// Fix: Import React to make its types available within this module for JSX augmentation.
import React from 'react';

export enum PerspectiveCharacter {
  Astronaut = 'Astronaut',
  Pilot = 'Pilot',
  Farmer = 'Farmer',
  Photographer = 'Photographer'
}

export interface CMEData {
  activityID: string;
  startTime: string;
  note: string;
  instruments: { displayName: string }[];
  cmeAnalyses: {
    time21_5: string;
    latitude: number;
    longitude: number;
    halfAngle: number;
    speed: number;
    type: string;
    isMostAccurate: boolean;
    note: string;
    levelOfData: number;
  }[];
}

// Fix: Correctly augment the JSX namespace for A-Frame custom elements
// by declaring a module augmentation for 'react'. This avoids overwriting
// the standard HTML element types and fixes errors project-wide.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-assets': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-asset-item': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-camera': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-gltf-model': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-light': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-entity': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-animation': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-sphere': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-torus': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-sky': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
      'a-text': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key:string]: any };
      // Fix: Add react-three-fiber intrinsic elements to prevent type errors in Earth.tsx
      primitive: any;
      ambientLight: any;
      directionalLight: any;
    }
  }
}
