/**
 * @summary
 * Reusable Zod validation helpers for common field types
 *
 * @module utils/zodValidation
 */

import { z } from 'zod';

/**
 * @summary
 * Validates a required string field with maximum length
 *
 * @function zString
 * @module utils/zodValidation
 *
 * @param {number} [maxLength] - Maximum string length
 *
 * @returns {z.ZodString} Zod string schema
 *
 * @example
 * const schema = z.object({
 *   title: zString(100)
 * });
 */
export const zString = (maxLength?: number) => {
  let schema = z.string().min(1);
  if (maxLength) {
    schema = schema.max(maxLength);
  }
  return schema;
};

/**
 * @summary
 * Validates a nullable string field with maximum length
 *
 * @function zNullableString
 * @module utils/zodValidation
 *
 * @param {number} [maxLength] - Maximum string length
 *
 * @returns {z.ZodNullable<z.ZodString>} Zod nullable string schema
 *
 * @example
 * const schema = z.object({
 *   description: zNullableString(500)
 * });
 */
export const zNullableString = (maxLength?: number) => {
  let schema = z.string();
  if (maxLength) {
    schema = schema.max(maxLength);
  }
  return schema.nullable();
};

/**
 * @summary
 * Validates a required name field (max 100 characters)
 *
 * @constant zName
 * @module utils/zodValidation
 *
 * @type {z.ZodString}
 *
 * @example
 * const schema = z.object({
 *   name: zName
 * });
 */
export const zName = z.string().min(1).max(100);

/**
 * @summary
 * Validates a nullable description field (max 500 characters)
 *
 * @constant zNullableDescription
 * @module utils/zodValidation
 *
 * @type {z.ZodNullable<z.ZodString>}
 *
 * @example
 * const schema = z.object({
 *   description: zNullableDescription
 * });
 */
export const zNullableDescription = z.string().max(500).nullable();

/**
 * @summary
 * Validates a required integer foreign key
 *
 * @constant zFK
 * @module utils/zodValidation
 *
 * @type {z.ZodNumber}
 *
 * @example
 * const schema = z.object({
 *   idUser: zFK
 * });
 */
export const zFK = z.number().int().positive();

/**
 * @summary
 * Validates a nullable integer foreign key
 *
 * @constant zNullableFK
 * @module utils/zodValidation
 *
 * @type {z.ZodNullable<z.ZodNumber>}
 *
 * @example
 * const schema = z.object({
 *   idParent: zNullableFK
 * });
 */
export const zNullableFK = z.number().int().positive().nullable();

/**
 * @summary
 * Validates a BIT field (0 or 1)
 *
 * @constant zBit
 * @module utils/zodValidation
 *
 * @type {z.ZodNumber}
 *
 * @example
 * const schema = z.object({
 *   active: zBit
 * });
 */
export const zBit = z.number().int().min(0).max(1);

/**
 * @summary
 * Validates a date string in ISO format
 *
 * @constant zDateString
 * @module utils/zodValidation
 *
 * @type {z.ZodString}
 *
 * @example
 * const schema = z.object({
 *   dueDate: zDateString
 * });
 */
export const zDateString = z.string().datetime();

/**
 * @summary
 * Validates a nullable date string in ISO format
 *
 * @constant zNullableDateString
 * @module utils/zodValidation
 *
 * @type {z.ZodNullable<z.ZodString>}
 *
 * @example
 * const schema = z.object({
 *   dueDate: zNullableDateString
 * });
 */
export const zNullableDateString = z.string().datetime().nullable();
