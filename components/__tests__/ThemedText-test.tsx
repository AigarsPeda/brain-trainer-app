import * as React from "react";
import renderer, { act } from "react-test-renderer";

import { ThemedText } from "../ThemedText";

it(`renders correctly`, () => {
  let tree: renderer.ReactTestRenderer | null = null;

  act(() => {
    tree = renderer.create(<ThemedText>Snapshot test!</ThemedText>);
  });

  const json = tree?.toJSON();

  expect(json).not.toBeNull();
  expect(Array.isArray(json)).toBe(false);

  if (!json || Array.isArray(json)) {
    throw new Error("Expected a single rendered Text node");
  }

  expect(json.children).toEqual(["Snapshot test!"]);
  expect(json.props.style).toEqual(
    expect.arrayContaining([{ color: "#ECEDEE" }, { fontFamily: "BalooBhai2_400Regular", fontSize: 16 }])
  );
});
