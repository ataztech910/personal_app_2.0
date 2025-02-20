import * as React from 'react';

declare module "react-lineicons" {
  export interface LineIconProps extends React.SVGProps<SVGSVGElement> {
    name: string;
  }

  const LineIcon: React.FC<LineIconProps>;

  export default LineIcon;
}