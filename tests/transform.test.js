import { describe, test, expect } from '@jest/globals';
import {
  transformTailwindClasses,
  TAILWIND_LTR_TO_RTL_MAPPINGS,
  RTL_SPECIFIC_UTILITIES,
  DIRECTIONAL_ICON_COMPONENTS
} from '../index.js';

describe('Tailwind RTL Transformation', () => {
  describe('Padding and Margin Transformations', () => {
    test('should transform padding-left to padding-start', () => {
      const input = 'className="pl-4 pr-2"';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className="ps-4 pe-2"');
    });

    test('should transform margin classes', () => {
      const input = 'className="ml-auto mr-4"';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className="ms-auto me-4"');
    });

    test('should handle multiple padding/margin classes', () => {
      const input = 'className="pl-2 pr-4 ml-6 mr-8"';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className="ps-2 pe-4 ms-6 me-8"');
    });
  });

  describe('Positioning Transformations', () => {
    test('should transform left/right position classes', () => {
      const input = 'className="left-0 right-4"';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className="start-0 end-4"');
    });

    test('should transform absolute positioning', () => {
      const input = 'className="absolute left-2 top-4"';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className="absolute start-2 top-4"');
    });
  });

  describe('Border Radius Transformations', () => {
    test('should transform rounded left/right classes', () => {
      const input = 'className="rounded-l-lg rounded-r-sm"';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className="rounded-s-lg rounded-e-sm"');
    });

    test('should transform specific corner radius', () => {
      const input = 'className="rounded-tl-lg rounded-br-md"';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className="rounded-ts-lg rounded-be-md"');
    });
  });

  describe('Border Width Transformations', () => {
    test('should transform border-left/right classes', () => {
      const input = 'className="border-l-2 border-r-4"';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className="border-s-2 border-e-4"');
    });

    test('should handle border with color', () => {
      const input = 'className="border-l border-r-2"';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className="border-s border-e-2"');
    });
  });

  describe('Text Alignment Transformations', () => {
    test('should transform text alignment classes', () => {
      const input = 'className="text-left"';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className="text-start"');
    });

    test('should transform text-right to text-end', () => {
      const input = 'className="text-right"';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className="text-end"');
    });
  });

  describe('Animation Direction Transformations', () => {
    test('should transform slide animations', () => {
      const input = 'className="slide-in-from-left"';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className="slide-in-from-start"');
    });

    test('should transform slide-out animations', () => {
      const input = 'className="slide-out-to-right"';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className="slide-out-to-end"');
    });
  });

  describe('Data Attributes Transformations', () => {
    test('should transform data-side attributes', () => {
      const input = 'data-side="left" className="some-class"';
      const output = transformTailwindClasses(input);
      expect(output).toContain('data-side="start"');
    });

    test('should handle data-side=right', () => {
      const input = '[data-side=right]:translate-x-1';
      const output = transformTailwindClasses(input);
      expect(output).toContain('[data-side=end]');
    });
  });

  describe('Complex Component Transformations', () => {
    test('should handle React component with multiple classes', () => {
      const input = `
        <div className="flex items-center pl-4 pr-2 ml-auto text-left border-l-2">
          Content
        </div>
      `;
      const output = transformTailwindClasses(input);
      expect(output).toContain('ps-4');
      expect(output).toContain('pe-2');
      expect(output).toContain('ms-auto');
      expect(output).toContain('text-start');
      expect(output).toContain('border-s-2');
    });

    test('should handle dynamic className with template literal', () => {
      const input = 'className={`pl-4 ${isActive ? "ml-2" : "mr-2"}`}';
      const output = transformTailwindClasses(input);
      expect(output).toContain('ps-4');
      expect(output).toContain('ms-2');
      expect(output).toContain('me-2');
    });

    test('should handle cn() utility function', () => {
      const input = 'className={cn("pl-4 text-left", isActive && "ml-2")}';
      const output = transformTailwindClasses(input);
      expect(output).toContain('ps-4');
      expect(output).toContain('text-start');
      expect(output).toContain('ms-2');
    });
  });

  describe('Radio and Switch Component Fixes', () => {
    test('should add RTL translation for Radio component', () => {
      const input = 'className="start-1/2 -translate-x-1/2"';
      const output = transformTailwindClasses(input);
      expect(output).toContain('rtl:translate-x-1/2');
    });

    test('should add RTL translation for Switch component', () => {
      const input = 'className="data-[state=checked]:translate-x-[calc(100%-2px)]"';
      const output = transformTailwindClasses(input);
      expect(output).toContain('rtl:data-[state=checked]:-translate-x-[calc(100%-2px)]');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty className', () => {
      const input = 'className=""';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className=""');
    });

    test('should preserve non-directional classes', () => {
      const input = 'className="flex items-center justify-between p-4"';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className="flex items-center justify-between p-4"');
    });

    test('should handle mixed quotes', () => {
      const input = `className='pl-4' class="mr-2"`;
      const output = transformTailwindClasses(input);
      expect(output).toContain("ps-4");
      expect(output).toContain("me-2");
    });

    test('should not transform already RTL classes', () => {
      const input = 'className="ps-4 pe-2 ms-auto"';
      const output = transformTailwindClasses(input);
      expect(output).toBe('className="ps-4 pe-2 ms-auto"');
    });
  });
});

describe('Constants and Mappings', () => {
  test('should have all required LTR to RTL mappings', () => {
    expect(TAILWIND_LTR_TO_RTL_MAPPINGS).toHaveProperty('pl-');
    expect(TAILWIND_LTR_TO_RTL_MAPPINGS).toHaveProperty('pr-');
    expect(TAILWIND_LTR_TO_RTL_MAPPINGS).toHaveProperty('ml-');
    expect(TAILWIND_LTR_TO_RTL_MAPPINGS).toHaveProperty('mr-');
    expect(TAILWIND_LTR_TO_RTL_MAPPINGS).toHaveProperty('left-');
    expect(TAILWIND_LTR_TO_RTL_MAPPINGS).toHaveProperty('right-');
  });

  test('should have RTL utility classes', () => {
    expect(RTL_SPECIFIC_UTILITIES).toHaveProperty('rtl:space-x-reverse');
    expect(RTL_SPECIFIC_UTILITIES).toHaveProperty('rtl:slide-in-from-start');
  });

  test('should have directional icon components list', () => {
    expect(DIRECTIONAL_ICON_COMPONENTS).toContain('ChevronLeft');
    expect(DIRECTIONAL_ICON_COMPONENTS).toContain('ChevronRight');
    expect(DIRECTIONAL_ICON_COMPONENTS).toContain('ArrowLeft');
    expect(DIRECTIONAL_ICON_COMPONENTS).toContain('ArrowRight');
  });
});