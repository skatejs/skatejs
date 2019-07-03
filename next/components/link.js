import Element, { React } from "@skatejs/element-react";
import NextLink from "next/link";
import Router from "next/router";
import css from "@skatejs/shadow-css";
import { shared } from "../styles";

export class Link extends Element {
  static get props() {
    return {
      as: String,
      href: String
    };
  }
  onClick = e => {
    Router.push(this.href, this.as);
  };
  render() {
    return (
      <>
        <style>{shared.toString()}</style>
        <NextLink as={this.as} href={this.href}>
          <a onClick={this.onClick}>
            <slot />
          </a>
        </NextLink>
      </>
    );
  }
}
