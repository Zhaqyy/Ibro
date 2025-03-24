import React, { useRef, useMemo, forwardRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * @typedef {Object} TextSplitProps
 * @property {React.ReactNode} children - Text content to animate
 * @property {React.ElementType} [as] - Wrapper element/component type
 * @example <TextSplit as="h1">Heading</TextSplit>
 * @property {React.ElementType} [unitAs] - Element type for individual animated units
 * @example <TextSplit unitAs="div">Blocks</TextSplit>
 * @property {'char'|'word'|'line'|Function} [splitBy] - Text splitting strategy
 * @example <TextSplit splitBy="word">Split by words</TextSplit>
 * @example <TextSplit splitBy={t => t.split('-')}>Custom split</TextSplit>
 * @property {'parent'|'self'|'none'} [trigger] - Animation trigger type
 * @example <TextSplit trigger="self">Hover individual units</TextSplit>
 * @property {'fade'|'slide'} [animation] - Preset animation style
 * @example <TextSplit animation="slide">Slide effect</TextSplit>
 * @property {Object} [animationConfig] - Animation configuration options
 * @example <TextSplit animationConfig={{ stagger: 0.2 }}>Custom timing</TextSplit>
 * @property {boolean} [hover] - Enable hover interactions
 * @example <TextSplit hover={false}>No hover</TextSplit>
 * @property {boolean|Object} [scroll] - Scroll-triggered animation
 * @example <TextSplit scroll={true}>Scroll animated</TextSplit>
 * @property {boolean} [animateInView] - Auto-animate when in viewport
 * @property {boolean} [active] - Manual animation control
 * @example <TextSplit active={isActive}>Controlled</TextSplit>
 * @property {Function} [onHover] - Hover start callback
 * @property {Function} [onUnhover] - Hover end callback
 * @property {boolean} [prefersReducedMotion] - Override motion preference
 */

/**
 * Advanced text splitting animation component with GSAP integration
 * @param {TextSplitProps} props
 */
const TextSplit = forwardRef(
  (
    {
      /** @type {React.ReactNode} */ children,
      /** @type {React.ElementType} */ as: Wrapper = "div",
      /** @type {React.ElementType} */ unitAs: Unit = "span",
      /** @type {'char'|'word'|'line'|Function} */ splitBy = "char",
      /** @type {'parent'|'self'|'none'} */ trigger = "parent",
      /** @type {'fade'|'slide'} */ animation = "fade",
      /** @type {Object} */ animationConfig = {},
      /** @type {boolean} */ hover = true,
      /** @type {boolean|Object} */ scroll = false,
      /** @type {boolean} */ animateInView = false,
      /** @type {boolean} */ active,
      /** @type {Function} */ onHover,
      /** @type {Function} */ onUnhover,
      /** @type {boolean} */ prefersReducedMotion = typeof window !== "undefined" 
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
      ...props
    },
    ref
  ) => {
    const wrapperRef = useRef();
    const { contextSafe } = useGSAP({ scope: wrapperRef });
    const tl = useRef(gsap.timeline({ paused: true }));
    const unitsRef = useRef([]);

    const animationPresets = (elements, options = {}) => ({
      fade: {
        enter: () => gsap.from(elements, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.1,
          ...options // Allows overriding any values
        }),
        exit: () => gsap.to(elements, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ...options
        })
      },
      slide: {
        enter: () => gsap.from(elements, {
          x: 100,
          rotation: 15,
          duration: 0.6,
          stagger: 0.1,
          ...options
        }),
        exit: () => gsap.to(elements, {
          x: -100,
          rotation: -15,
          duration: 0.6,
          ...options
        })
      }
    });

    // Split content logic
    const splitContent = useMemo(() => {
      if (!children) return [];
      const content = String(children);
      const strategies = {
        char: () => content.split(""),
        word: () => content.split(/\s+/).filter(w => w),
        line: () => content.split(/\n/),
        custom: () => splitBy(content)
      };
      return strategies[typeof splitBy === "function" ? "custom" : splitBy]?.() || [content];
    }, [children, splitBy]);

    // Animation setup
    useGSAP(() => {
      if (prefersReducedMotion) return;

      const elements = unitsRef.current;
      const presets = animationPresets(elements, animationConfig.options);
      const config = animationConfig.custom || presets[animation];

      tl.current.clear();

      if (scroll) {
        gsap.set(elements, { opacity: 0, y: 20 });
        tl.current.to(elements, {
          ...config.enter().vars,
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            ...scroll
          }
        });
      } else {
        tl.current.add(config.enter());
        if (animationConfig.exit) tl.current.add(config.exit(), "<");
      }

      if (animateInView) {
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top 80%",
          onEnter: () => tl.current.play(),
          onLeaveBack: () => tl.current.reverse()
        });
      }
    }, [animation, splitContent, scroll, animateInView, animationConfig]);

    // Controlled component
    useEffect(() => {
      if (typeof active !== "undefined") {
        active ? tl.current.play() : tl.current.reverse();
      }
    }, [active]);

    // Event handlers
    const createHandlers = index => ({
      onMouseEnter: contextSafe(() => {
        if (trigger === "self" && !prefersReducedMotion) {
          gsap.to(unitsRef.current[index], {
            scale: 1.2,
            duration: 0.3,
            overwrite: true,
          });
        }
        onHover?.();
      }),
      onMouseLeave: contextSafe(() => {
        if (trigger === "self" && !prefersReducedMotion) {
          gsap.to(unitsRef.current[index], {
            scale: 1,
            duration: 0.3,
            overwrite: true,
          });
        }
        onUnhover?.();
      }),
    });

    return (
      <Wrapper
        ref={mergeRefs(wrapperRef, ref)}
        {...(trigger === "parent" && {
          onMouseEnter: contextSafe(() => hover && !prefersReducedMotion && tl.current.play()),
          onMouseLeave: contextSafe(() => hover && !prefersReducedMotion && tl.current.reverse()),
        })}
        {...props}
      >
        {splitContent.map((unit, index) => (
          <Unit
            ref={el => (unitsRef.current[index] = el)}
            className='animated-unit'
            key={`${unit}-${index}`}
            style={{ display: "inline-block", whiteSpace: "pre" }}
            {...(trigger === "self" && createHandlers(index))}
          >
            {unit === " " ? "\u00A0" : unit}
          </Unit>
        ))}
      </Wrapper>
    );
  }
);

// Helper function to merge refs
const mergeRefs =
  (...refs) =>
  value => {
    refs.forEach(ref => {
      if (typeof ref === "function") ref(value);
      else if (ref != null) ref.current = value;
    });
  };

export default TextSplit;
