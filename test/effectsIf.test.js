import { action, effectsIf } from "../dist/effects"

describe("effectsIf", () => {
  it("should filter out effects with truthy conditionals", () =>
    expect(
      effectsIf([[true, action("include")], [false, action("exclude")]])
    ).toEqual([action("include")]))
})
