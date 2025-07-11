import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type AppointmentDocument = Appointment & Document

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ required: true, unique: true })
  appointmentId!: string

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patient!: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctor!: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Specialty', required: true })
  specialty!: Types.ObjectId

  @Prop({ required: true })
  date!: string

  @Prop({ required: true })
  slot!: string

  @Prop({ default: 'Asia/Ho_Chi_Minh' })
  timezone!: string

  @Prop({ type: Object })
  medicalForm?: Record<string, unknown>

  @Prop({
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING',
  })
  status!: string

  @Prop({ type: Date })
  confirmedAt?: Date

  @Prop({ type: Date })
  cancelledAt?: Date

  @Prop({ type: Date })
  completedAt?: Date

  @Prop()
  doctorNote?: string

  @Prop()
  reason?: string

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date

  @Prop({
    type: {
      platformFee: { type: Number, default: 0 },
      doctorFee: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      status: { type: String, default: 'UNPAID' },
      paymentMethod: { type: String, default: '' },
    },
  })
  payment?: {
    platformFee: number
    doctorFee: number
    discount: number
    total: number
    status: string
    paymentMethod?: string
  }

  @Prop()
  notes?: string

  @Prop()
  duration_call?: string

  @Prop({ type: Object })
  rating?: {
    ratingScore: number
    description: string
    ratedAt: Date
    ratedBy: string // patientId
  }
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment)

// Thêm middleware để đảm bảo createdAt và completedAt
AppointmentSchema.pre<AppointmentDocument>('save', function (next) {
  // Đảm bảo createdAt được set nếu chưa có (cho data cũ)
  if (this.isNew && !this.createdAt) {
    this.createdAt = new Date()
  }

  // Tự động set completedAt khi status chuyển thành COMPLETED
  if (this.status === 'COMPLETED' && !this.completedAt) {
    this.completedAt = new Date()
  }

  next()
})
