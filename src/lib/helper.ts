import { type ClassValue, clsx } from "clsx";
import omitBy from "lodash-es/omitBy";
import { twMerge } from "tailwind-merge";

/**
 * Sums the passed percentage to the R, G or B of a HEX color
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function addLight(color: string, amount: number) {
  const cc = parseInt(color, 16) + amount;
  const c = cc > 255 ? 255 : cc;
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
}

/**
 * Lightens a 6 char HEX color according to the passed percentage
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed color represented as HEX
 */
export function lighten(color: string, amount: number) {
  color = color?.indexOf("#") >= 0 ? color?.substring(1, color.length) : color;
  amount = Math.trunc((255 * amount) / 100);
  return `#${addLight(color?.substring(0, 2), amount)}${addLight(
    color?.substring(2, 4),
    amount
  )}${addLight(color?.substring(4, 6), amount)}`;
}

// cn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FalseType = "" | 0 | false | null | undefined;
export const typedBoolean = <Value>(value: Value): value is Exclude<Value, FalseType> => {
  return Boolean(value);
};

/**
 * 清理对象的无效值
 * @param obj 需要清理的对象
 * @param options 配置
 *   - removeNull: 是否移除 null (默认 true)
 *   - removeUndefined: 是否移除 undefined (默认 true)
 */
export function cleanObject<T extends Record<string, any>>(
  obj?: T,
  options: { removeNull?: boolean; removeUndefined?: boolean } = {}
): Partial<T> | undefined {
  const { removeNull = true, removeUndefined = true } = options;
  if (!obj) return undefined;

  const result = omitBy<Partial<T>>(obj, (value) => {
    if (removeNull && value === null) return true;
    if (removeUndefined && value === undefined) return true;
    return false;
  });

  return result;
}
