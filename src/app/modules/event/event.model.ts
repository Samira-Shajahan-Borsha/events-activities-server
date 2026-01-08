import { model, Schema } from "mongoose";
import { IEvent, EVENT_STATUS, IS_PAID } from "./event.interface";

const eventSchema = new Schema<IEvent>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, unique: true },
        type: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        date: { type: Date, required: true },
        location: { type: String, required: true, trim: true },
        minParticipants: { type: Number, default: 1 },
        maxParticipants: { type: Number },
        isPaid: {
            type: String,
            enum: {
                values: Object.values(IS_PAID),
                message: "{VALUE} is not supported for isPaid field",
            },
            default: IS_PAID.FREE,
        },
        joiningFee: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: Object.values(EVENT_STATUS),
            default: EVENT_STATUS.OPEN,
        },
        isFeatured: { type: Boolean, default: false },
        host: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

eventSchema.pre("save", async function () {
    if (this.isModified("name")) {
        const baseSlug = this.name.toLowerCase().split(" ").join("-");
        let slug = baseSlug;

        let counter = 0;
        while (await Event.exists({ slug })) {
            slug = `${baseSlug}-${counter++}`;
        }

        this.slug = slug;
    }
});

eventSchema.pre("findOneAndUpdate", async function () {
    const update = this.getUpdate() as Partial<IEvent>;
    if (update.name) {
        const baseSlug = update.name.toLowerCase().split(" ").join("-");
        let slug = baseSlug;

        let counter = 0;
        while (await Event.exists({ slug })) {
            slug = `${baseSlug}-${counter++}`;
        }

        update.slug = slug;
        this.setUpdate(update);
    }
});

export const Event = model<IEvent>("Event", eventSchema);
