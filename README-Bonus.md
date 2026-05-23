# Bonus Questions — Performance & Concurrency

เอกสารนี้อธิบายแนวทาง **Performance Optimization** และ **Concurrency Control** สำหรับระบบจองตั๋วคอนเสิร์ต โดยแยกชัดเจนว่าอะไร **ทำแล้วในโปรเจคนี้** และอะไร **ยังไม่ได้ทำ แต่แนะนำให้เพิ่ม** เมื่อข้อมูลและ traffic โตขึ้น

---

## 1. Performance Optimization

เมื่อ dataset ใหญ่ขึ้นและ traffic สูง จุดที่มักช้าก่อนคือ **การ query ข้อมูลทั้งก้อน**, **การคำนวณซ้ำ**, และ **การส่ง static assets ซ้ำๆ** จาก origin server

### 1.1 สิ่งที่ทำแล้วในโปรเจคนี้

#### Pagination — ไม่ดึงข้อมูลทั้งหมดในครั้งเดียว (ทำแล้วในโปรเจคนี้)

- **Backend:** `GET /concerts?page=&limit=` ใช้ `skip` / `take` ผ่าน TypeORM `findAndCount` ใน `ConcertsService.findPaginated()` — คืน `items`, `total`, `page`, `limit`, `hasMore`
- **Backend:** `GET /history` รองรับ pagination แบบเดียวกันสำหรับ admin history log
- **Frontend:** Infinite scroll รายการคอนเสิร์ต (4 รายการต่อหน้า) ด้วย `IntersectionObserver` ใน `ConcertOverviewList`
- **Frontend:** หน้า History ใช้ pagination แบบปุ่ม Prev/Next (10 รายการต่อหน้า)

ผลลัพธ์: แม้มีคอนเสิร์ตหลักพันรายการ แต่แต่ละ request โหลดเฉพาะส่วนที่ต้องแสดง ไม่ดึงทั้งตาราง

#### Denormalized Counter — ลดการนับซ้ำใน DB (ทำแล้วในโปรเจคนี้)

- ตาราง `concerts` เก็บ `reserved_count` และ `cancelled_count` ไว้ในตัว
- ตอนจอง/ยกเลิก อัปเดต counter ภายใน transaction เดียวกับการจอง
- หน้า Admin stats ใช้ `SUM()` aggregate ครั้งเดียว แทนการ `COUNT(*)` จากตาราง `reservations` ทุกครั้ง

#### Query ที่เลือกเฉพาะ field ที่ใช้ (ทำแล้วในโปรเจคนี้)

- `getActiveReservationConcertIds()` ดึงเฉพาะ `concertId` ไม่โหลด entity ทั้งก้อน

#### Database Schema ผ่าน Migration (ทำแล้วในโปรเจคนี้)

- ใช้ TypeORM migrations (`synchronize: false`) — เหมาะกับ production ที่ schema ต้องควบคุมได้
- Primary Key และ Unique Constraint บน `users.username`, `reservations(user_id, concert_id)` — PostgreSQL สร้าง index ให้ constraint เหล่านี้โดยอัตโนมัติ

#### Frontend Code Splitting & Loading UX (ทำแล้วในโปรเจคนี้)

- `next/dynamic` โหลด `ConcertOverviewList` แยก chunk พร้อม skeleton ตอนรอ
- `loading.tsx` ระดับ route สำหรับแสดง loading ระหว่างเปลี่ยนหน้า
- `HydrationGate` + `AppLoader` แสดง loading ตอน hydrate ครั้งแรก

---

### 1.2 สิ่งที่ยังไม่ได้ทำ แต่แนะนำเมื่อ traffic โต

#### Caching


| แนวทาง                                           | รายละเอียด                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------------- |
| **Redis / In-memory Cache**                      | cache รายการคอนเสิร์ตยอดนิยม, stats dashboard, session — ลด load ที่ PostgreSQL |
| **Application-level Cache (NestJS CacheModule)** | cache ผล `getStats()` TTL สั้นๆ (เช่น 30 วินาที)                                |
| **Frontend Cache (React Query / SWR)**           | cache API response ฝั่ง client ลด request ซ้ำตอน navigate กลับมา                |


#### Database Indexing เพิ่มเติม


| Index ที่แนะนำ                  | เหตุผล                                          |
| ------------------------------- | ----------------------------------------------- |
| `concerts(created_at)`          | เรียงลำดับ pagination เร็วขึ้นเมื่อมีหลักแสนแถว |
| `reservations(user_id, status)` | query ว่า user จองอะไรอยู่เร็วขึ้น              |
| `history_logs(date_time DESC)`  | admin history เรียงตามเวลาล่าสุด                |


#### CDN & Static Assets

- วาง **CloudFront / Cloudflare CDN** หน้า Next.js static files (`/_next/static/`*)
- ใช้ `next/image` สำหรับรูปภาพ (lazy load + responsive + WebP)
- ตั้ง `assetPrefix` ถ้า deploy static แยกจาก origin

#### Infrastructure & Backend Tuning

- **Connection Pooling** — กำหนด `extra.max` ใน TypeORM config ให้เหมาะกับจำนวน concurrent request
- **Read Replica** — แยก read (list concerts) กับ write (reserve) เมื่อ read หนักมาก
- **Rate Limiting** — `@nestjs/throttle` ป้องกัน abuse บน endpoint จอง
- **Compression** — เปิด gzip/brotli บน API response
- **Horizontal Scaling** — รัน backend หลาย instance หลัง load balancer (stateless + JWT)

#### Frontend เพิ่มเติม

- **ISR / SSR + revalidate** สำหรับหน้าที่เปลี่ยนไม่บ่อย
- **Virtualized List** (react-window) ถ้ารายการใน DOM ยาวมากแม้จะ paginate แล้ว

---

### 1.3 สรุป Performance

```
Traffic ต่ำ → ปัจจุบัน (pagination + counter + code split) เพียงพอ
Traffic กลาง → + Redis cache + DB index + rate limit
Traffic สูง → + CDN + read replica + horizontal scale + queue สำหรับ write-heavy
```

---

## 2. Concurrency Control

### สถานการณ์: 1,000 users พยายามจองที่นั่ง 10 ที่สุดท้ายใน millisecond เดียวกัน

เป้าหมาย: **ไม่ over-book** (จองเกิน `total_seats`) และ **ไม่ double-book** (user เดียวจองซ้ำ)

---

### 2.1 สิ่งที่ทำแล้วในโปรเจคนี้

#### Database Transaction (ทำแล้วในโปรเจคนี้)

`reserveConcert()` และ `cancelReservation()` ห่อ logic ทั้งหมดใน `dataSource.transaction()` — ถ้าขั้นตอนใดล้มเหลว ทุกอย่าง rollback ไม่เกิดสถานะข้อมูลไม่สอดคล้องกัน

ลำดับใน transaction จอง:

1. Lock แถว concert
2. เช็คที่ว่าง (`reservedCount < totalSeats`)
3. เช็คว่า user ยังไม่มี active reservation
4. Insert reservation
5. เพิ่ม `reservedCount`
6. บันทึก history log

#### Pessimistic Locking — `SELECT ... FOR UPDATE` (ทำแล้วในโปรเจคนี้)

```typescript
.setLock('pessimistic_write')  // → SELECT ... FOR UPDATE
```

- Lock แถว `concerts` ก่อนเช็คและอัปเดต `reserved_count`
- Request อื่นที่มาพร้อมกันจะ **รอคิว** จน transaction แรก commit
- Request ที่ 11–1000 หลัง 10 ที่เต็มแล้ว จะได้ error `"Tickets are full"` อย่างถูกต้อง

**ทำไมเลือก Pessimistic Locking?**

- เหมาะกับ **contention สูง** (หลายคนแย่งที่นั่งสุดท้าย)
- Logic ชัดเจน: lock → เช็ค → อัปเดต → commit
- ไม่ต้อง retry loop แบบ optimistic lock

#### Unique Constraint — กันจองซ้ำระดับ DB (ทำแล้วในโปรเจคนี้)

```sql
CONSTRAINT "UQ_reservations_user_concert" UNIQUE ("user_id", "concert_id")
```

- แม้ application layer พลาด race condition ระหว่าง `findOne` กับ `insert` ฝั่ง DB จะ reject duplicate ด้วย error `23505`
- Service จับ error นี้แล้วแปลงเป็น `409 Conflict`

#### Business Rule Validation ใน Transaction (ทำแล้วในโปรเจคนี้)

- `reservedCount >= totalSeats` → `400 Bad Request: Tickets are full`
- Active reservation ซ้ำ → `400 Bad Request` ก่อน insert
- Unique violation → `409 Conflict`

#### Frontend — ป้องกันคลิกซ้ำระดับ UI (ทำแล้วในโปรเจคนี้)

- ปุ่ม Reserve/Cancel ถูก `disabled` ขณะ request กำลังทำงาน (`isReserving` / `isCancelling`)
- ลด duplicate request จาก user คนเดียว แต่ **ไม่ใช่** กลไกกัน over-booking หลัก (ฝั่ง server เป็นตัวตัดสิน)

#### Unit Tests (ทำแล้วในโปรเจคนี้)

- `reservations.service.spec.ts` ทดสอบ transaction flow, unique violation, และ error cases

---

### 2.2 Flow เมื่อ 1,000 users จอง 10 ที่สุดท้าย

```
User 1–10:  lock concert → seats available → insert → count++ → commit ✅
User 11:     lock concert (รอ...) → seats full → 400 "Tickets are full" ❌
User 12–1000: เหมือน User 11 ❌
```

PostgreSQL จัดการ queue ของ lock ให้ — ไม่มี 2 transaction อ่าน `reservedCount = 9` แล้ว increment เป็น 10 พร้อมกันได้

---

### 2.3 สิ่งที่ยังไม่ได้ทำ แต่แนะนำเมื่อ scale ขึ้น

#### Optimistic Locking

- เพิ่มคอลัมน์ `@Version` บน `concerts`
- อัปเดตด้วย `WHERE id = ? AND version = ?` — ถ้า version เปลี่ยนแล้ว retry
- เหมาะเมื่อ **conflict น้อย** แต่ต้องการ throughput สูงกว่า pessimistic lock

#### Message Queue (BullMQ / Kafka / RabbitMQ)

```
Client → POST /reserve → enqueue job → 202 Accepted
Worker → process ทีละ job ด้วย DB lock → notify ผล
```

- รับ request ได้เร็ว ไม่ block HTTP connection
- ควบคุม concurrency ของ worker ได้ (เช่น process 50 jobs พร้อมกัน)
- เหมาะเมื่อ traffic spike มาก (flash sale)

#### Idempotency Key

- Client ส่ง header `Idempotency-Key: uuid` ต่อการจอง
- Server เก็บ key ใน Redis/DB — request ซ้ำได้ผลลัพธ์เดิม ไม่จองซ้ำ
- ป้องกัน double-submit จาก network retry

#### Distributed Lock (Redis Redlock)

- ใช้เมื่อ backend รันหลาย instance — DB lock ยังพออยู่ถ้า write ไป DB เดียว แต่ distributed lock ช่วย coordinate งานข้าม service

#### Seat-level Inventory

- ปัจจุบันใช้ **counter ระดับคอนเสิร์ต** (1 user จองได้ 1 ที่ต่อคอนเสิร์ต)
- ถ้าต้องเลือกที่นั่งเฉพาะ (A1, A2, …) ควรมีตาราง `seats` + unique `(concert_id, seat_number)` แทน counter

#### Load / Chaos Testing

- ยังไม่มี E2E test จำลอง 1,000 concurrent requests
- แนะนำใช้ **k6** หรือ **Artillery** ทดสอบว่า `reserved_count` ไม่เกิน `total_seats` หลัง spike

#### Serializable Isolation / Advisory Lock

- ยังใช้ default isolation level ของ PostgreSQL (Read Committed) + row lock
- ถ้า logic ซับซ้อนขึ้น อาจพิจารณา `SERIALIZABLE` หรือ `pg_advisory_xact_lock(concert_id)`

---

#### ขอบคุณสำหรับการให้เข้าร่วม Assignment

เป็นเกียรติอย่างยิ่งที่ได้รับโอกาสให้ทำ Assignment ในครั้งนี้ หากสงสัยตรงไหน หรือต้องการข้อมูลเพิ่ม สามารถติดต่อได้ที่

Tel. -> 099-164-9330

Email -> [ratthasart.boonchit@gmail.com](mailto:ratthasart.boonchit@gmail.com)

ขอบคุณครับ