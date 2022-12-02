import React from 'react';
import { LiFiWidget, WidgetConfig } from '@lifi/widget';

const widgetConfig: WidgetConfig = {
  integrator: 'Perseus',
  toChain: 137,
  toToken: '0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2',
  containerStyle: {
    border: '1px solid rgb(234, 234, 234)',
    borderRadius: '16px',
  },
};

export const SwapWidget = () => {
  return <LiFiWidget config={widgetConfig} />;
};