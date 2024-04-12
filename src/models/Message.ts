import { Schema, Document, models, Model, model } from "mongoose";


export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});


const MessageModel =
  (models.Message as Model<Message>) ||
    model<Message>("Message", MessageSchema);

export default MessageModel;