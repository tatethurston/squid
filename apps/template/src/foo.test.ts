import { describe, it, expect } from "@jest/globals";
import { foo } from "./foo";

describe("foo", () => {
  it("test", () => {
    expect(foo()).toEqual("foo");
  });
});
