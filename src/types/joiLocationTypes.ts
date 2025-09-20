import Joi from 'joi';
import { isValidTimeSlotArray } from '../util/time';
import { IReadOnlyLocation_FromAPI_PreProcessed } from './locationTypes';
import assert from '../util/assert';

const { string, number, boolean } = Joi.types();
const ITimeSlotJoiSchema = Joi.object({
    day: number.min(0).max(6).required(),
    hour: number.min(0).max(23).required(),
    minute: number.min(0).max(59).required(),
});
const ITimeRangeJoiSchema = Joi.object({
    start: ITimeSlotJoiSchema.required(),
    end: ITimeSlotJoiSchema.required(),
});
const ISpecialJoiSchema = Joi.object({
    title: string.required(),
    description: string.required().allow(''),
});

// Note: Keys without .required() are optional by default
export const ILocationAPIJoiSchema = Joi.object<IReadOnlyLocation_FromAPI_PreProcessed>({
    conceptId: number.required(),
    name: string,
    shortDescription: string,
    description: string.required(),
    grubhubUrl: string,
    url: string.required(),
    menu: string,
    location: string.required(),
    coordinates: {
        lat: number.required(),
        lng: number.required(),
    },
    acceptsOnlineOrders: boolean.required(),
    times: Joi.array()
        .items(ITimeRangeJoiSchema)
        .required()
        .custom((val) => {
            assert(isValidTimeSlotArray(val));
            return val;
        })
        .message('Received invalid (probably improperly sorted) time slots!'),
    todaysSpecials: Joi.array().items(ISpecialJoiSchema),
    todaysSoups: Joi.array().items(ISpecialJoiSchema),
});
export const IAPIResponseJoiSchema = Joi.object<{ locations: any[] }>({
    locations: Joi.array().required(),
}); // shallow validation to make sure we have the locations field. That's it.
