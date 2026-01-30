import * as React from 'react';

export function Separator(props: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      {...props}
      className={
        (props.className ? props.className + ' ' : '') +
        'border-t border-gray-200 my-2 bg-transparent'
      }
    />
  );
}

export default Separator;
