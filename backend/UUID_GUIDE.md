# Implementasi UUID di NestJS

Untuk men-generate UUID di NestJS, Anda memiliki dua cara utama: menggunakan modul bawaan Node.js (`crypto`) atau menggunakan library pihak ketiga (`uuid`).

## 1. Menggunakan Modul Bawaan (Node.js 14.17+)
Ini adalah cara yang direkomendasikan karena tidak memerlukan instalasi package tambahan.

```typescript
import { randomUUID } from 'crypto';

// Contoh penggunaan:
const uuid = randomUUID();
console.log(uuid); // "550e8400-e29b-41d4-a716-446655440000"
```

## 2. Menggunakan Library `uuid`
Jika Anda menggunakan versi Node.js lama atau butuh fitur lebih spesifik (seperti v1, v3, atau v5), Anda bisa menggunakan package `uuid`.

### Instalasi:
```bash
npm install uuid
npm install --save-dev @types/uuid
```

### Penggunaan:
```typescript
import { v4 as uuidv4 } from 'uuid';

const uuid = uuidv4();
```

## 3. Dalam Prisma Schema (Sudah Anda Gunakan)
Berdasarkan file `schema.prisma` Anda, Anda sudah menggunakan UUID untuk ID otomatis:
```prisma
model User {
  id String @id @default(uuid())
}
```

## Contoh Implementasi di Service
Jika Anda ingin menggunakannya di `midtrans.service.ts` (misalnya untuk `orderId`):

```typescript
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class MidtransService {
  generateOrderId() {
    return `ORDER-${randomUUID()}`;
  }
}
```
