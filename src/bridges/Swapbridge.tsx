import React from 'react';
import { LiFiWidget, WidgetConfig } from '@lifi/widget';

const widgetConfig: WidgetConfig = {
  integrator: 'Perseus',
  toChain: 137,
  toToken: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
  containerStyle: {
    border: '1px solid rgb(234, 234, 234)',
    borderRadius: '16px',
  },
};

export const SwapWidget = () => {
  return <LiFiWidget config={widgetConfig} />;
};