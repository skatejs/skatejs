// @flow

import { withProps } from "./with-props";
import { withRenderer } from "./with-renderer";
import { withUnique } from "./with-unique";

export const withComponent = (Base?: Class<any>) =>
  withProps(withRenderer(withUnique(Base || HTMLElement)));
