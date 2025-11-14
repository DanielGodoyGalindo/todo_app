import { Schema, model, models } from 'mongoose'

const NoteSchema = new Schema({
  title: { type: String, required: false },
  content: { type: String, default: false },
  userEmail: {  type: String,  required: true, unique: true}
}, { timestamps: true })

const Note = models.Note || model('Note', NoteSchema)
export default Note