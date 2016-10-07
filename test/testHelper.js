export expect, {createSpy, spyOn, isSpy} from 'expect';
export simple from 'simple-mock';
export nock from 'nock';
import '../js/utils/arrayExtensions';

export function roundDecimal(num, decimal = 0) {
  decimal = Math.pow(10, decimal);
  return Math.round(num * decimal) / decimal
}