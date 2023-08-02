import { Frame, useFrameProcessor } from 'react-native-vision-camera';
import { useState } from 'react';
import { runOnJS } from 'react-native-reanimated';

import {
  Barcode,
  BarcodeFormat,
  CodeScannerOptions,
  scanBarcodes,
} from './common';

export function useScanBarcodes(
  types: BarcodeFormat[],
  options?: CodeScannerOptions
): [(frame: Frame) => void, Barcode[], number, number] {
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);
  const [frameWidth, setFrameWidth] = useState<number>(1);
  const [frameHeight, setFrameHeight] = useState<number>(1);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const detectedBarcodes = scanBarcodes(frame, types, options);
    runOnJS(setBarcodes)(detectedBarcodes);
    runOnJS(setFrameWidth)(frame.width);
    runOnJS(setFrameHeight)(frame.height);
  }, []);

  return [frameProcessor, barcodes, frameWidth, frameHeight];
}
