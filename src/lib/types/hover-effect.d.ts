declare module "hover-effect" {
  // Interface for HoverEffect options
  interface HoverEffectOptions {
    /**
     * The DOM element where the animation will be rendered.
     * The images will fit the size of the parent element.
     */
    parent: HTMLElement;

    /**
     * The first image for the animation.
     */
    image1: string;

    /**
     * The second image for the animation.
     */
    image2: string;

    /**
     * The displacement image used for transitioning between the two main images.
     */
    displacementImage: string;

    /**
     * Defines the intensity of the distortion effect.
     * 0 - no effect, 1 - maximum distortion.
     * @default 1
     */
    intensity?: number;

    /**
     * Overrides distortion intensity for the first image.
     * @default intensity
     */
    intensity1?: number;

    /**
     * Overrides distortion intensity for the second image.
     * @default intensity
     */
    intensity2?: number;

    /**
     * Distortion angle in radians.
     * @default Math.PI / 4 (45 degrees)
     */
    angle?: number;

    /**
     * Overrides the distortion angle for the first image.
     * @default angle
     */
    angle1?: number;

    /**
     * Overrides the distortion angle for the second image.
     * @default -angle * 3
     */
    angle2?: number;

    /**
     * Speed of the "in" animation (in seconds).
     * @default 1.6
     */
    speedIn?: number;

    /**
     * Speed of the "out" animation (in seconds).
     * @default 1.2
     */
    speedOut?: number;

    /**
     * If set to false, the animation will not trigger on hover.
     * @default true
     */
    hover?: boolean;

    /**
     * Easing function for the transition (see GSAP easing).
     * @default Expo.easeOut
     */
    easing?: string;

    /**
     * Determines whether to use videos instead of images.
     * Note: You need two videos; it doesn’t work with one image and one video.
     * @default false
     */
    video?: boolean;

    /**
     * Set this if you want to use `background: cover` behavior.
     * Otherwise, a square aspect ratio will be applied.
     * Example usage: image height / image width.
     * Example: 1080 / 1920
     * @default 1
     */
    imagesRatio?: number;
  }

  // Main export of hover-effect
  export default class HoverEffect {
    constructor(options: HoverEffectOptions);

    /**
     * Transition to the next image.
     */
    next(): void;

    /**
     * Transition to the previous image.
     */
    previous(): void;
  }
}
