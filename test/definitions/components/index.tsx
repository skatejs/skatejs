import * as skate from 'skatejs'
import { h, define } from 'skatejs'

import { ButtonComponent, InputComponent } from '../custom-base'

export type ButtonProps = {
  raised?: boolean
}
export class MaterialButton extends ButtonComponent<ButtonProps> {

  static get props() {
    return {
      raised: ''
    }
  }
  foo() {
    this.props.raised
    // @TODO this doesn't work
    // this.type
  }
  // now our MaterialButton has all <button> default behaviours and props
}
define(MaterialButton)


export type InputProps = {
  touched?: boolean
}
export class MaterialInput extends InputComponent<InputProps> {
  // now our MaterialInput has all <input> default behaviours and props
  foo() {
    this.props.touched
    // this.type
  }
}

define(MaterialInput)
//
