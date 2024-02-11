import { FunctionComponent } from 'react';
import { Switch } from '@headlessui/react';
import { classNames } from '../utilities/classNames';

interface Props {
  value: boolean;
  onChange: (enabled: boolean) => void;
}

export const Toggle: FunctionComponent<Props> = ({
  value: enabled,
  onChange,
}) => {
  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      className={classNames(
        enabled ? 'bg-purple-600' : 'bg-slate-200',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2',
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
        )}
      />
    </Switch>
  );
};
