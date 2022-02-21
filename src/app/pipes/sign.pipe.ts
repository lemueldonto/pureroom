import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe }         from '@angular/common';

@Pipe({
    name: 'sign',
})
export class SignPipe implements PipeTransform {

    constructor(public numberPipe: DecimalPipe) {
    }

    transform(value: number, digitsInfo?: string): string | null {
        const maybeSign = value > 0 ? '+' : '';
        const str       = this.numberPipe.transform(value, digitsInfo);

        return str !== null ? maybeSign + str : null;
    }

}
