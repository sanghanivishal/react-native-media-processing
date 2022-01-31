/**
 * @author Vishal Sanghani
 * Date: 23/01/22
 */
import BaseEnum from "./base-enum";

export default class WatermarkPosition extends BaseEnum {
  static BOTTOM_LEFT = "5:H-h-5";
  static BOTTOM_RIGHT = "W-w-5:H-h-5";
  static TOP_LEFT = "5:5";
  static TOP_RIGHT = "W-w-5:5";
  static CENTER = "(W-w)/2:(H-h)/2";
}
