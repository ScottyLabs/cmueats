// taken from https://stackoverflow.com/questions/13488957/interpolate-from-one-color-to-another

function rgbToLinear(channelValue: number) {
    const s = channelValue / 255;

    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
function linearToRgb(channelValue: number) {
    const s = channelValue <= 0.0031308 ? channelValue * 12.92 : 1.055 * channelValue ** (1.0 / 2.4) - 0.055;
    return s * 255;
}
function hexToNumber(rgb: string): [number, number, number] {
    const result = [-1, -1, -1] as [number, number, number];
    for (let i = 0; i < 3; i++) {
        result[i] = parseInt(rgb.substring(2 * i, 2 * i + 2), 16);
    }
    return result;
}
function numberToHex(rgb: [number, number, number]) {
    return rgb.map((val) => val.toString(16).padStart(2, '0')).join('');
}
// eslint-disable-next-line import/prefer-default-export
export function redToGreenInterpolation(fraction: number) {
    const c1 = hexToNumber('DD3C18'); // red
    const c2 = hexToNumber('1DB875'); // green
    const blendColor: [number, number, number] = [-1, -1, -1];
    for (let i = 0; i < 3; i++) {
        const channel1 = rgbToLinear(c1[i]!);
        const channel2 = rgbToLinear(c2[i]!);
        blendColor[i] = Math.round(linearToRgb((channel2 - channel1) * fraction + channel1));
    }
    return `#${numberToHex(blendColor)}`;
}
