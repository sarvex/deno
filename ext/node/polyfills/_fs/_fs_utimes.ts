// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.

import type { CallbackWithError } from "internal:deno_node/_fs/_fs_common.ts";
import { fromFileUrl } from "internal:deno_node/path.ts";
import { promisify } from "internal:deno_node/internal/util.mjs";

function getValidTime(
  time: number | string | Date,
  name: string,
): number | Date {
  if (typeof time === "string") {
    time = Number(time);
  }

  if (
    typeof time === "number" &&
    (Number.isNaN(time) || !Number.isFinite(time))
  ) {
    throw new Deno.errors.InvalidData(
      `invalid ${name}, must not be infinity or NaN`,
    );
  }

  return time;
}

export function utimes(
  path: string | URL,
  atime: number | string | Date,
  mtime: number | string | Date,
  callback: CallbackWithError,
) {
  path = path instanceof URL ? fromFileUrl(path) : path;

  if (!callback) {
    throw new Deno.errors.InvalidData("No callback function supplied");
  }

  atime = getValidTime(atime, "atime");
  mtime = getValidTime(mtime, "mtime");

  Deno.utime(path, atime, mtime).then(() => callback(null), callback);
}

export const utimesPromise = promisify(utimes) as (
  path: string | URL,
  atime: number | string | Date,
  mtime: number | string | Date,
) => Promise<void>;

export function utimesSync(
  path: string | URL,
  atime: number | string | Date,
  mtime: number | string | Date,
) {
  path = path instanceof URL ? fromFileUrl(path) : path;
  atime = getValidTime(atime, "atime");
  mtime = getValidTime(mtime, "mtime");

  Deno.utimeSync(path, atime, mtime);
}
