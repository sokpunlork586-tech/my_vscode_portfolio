'use client';

/**
 * Generic GHButton component.
 */
import React, { useState, useEffect } from 'react';
import { useLocalStorageState } from '../../hooks';
import ButtonLink, { ButtonLinkProps } from '../ButtonLink';
import { LocalCache } from '../../models';
import { buildRecordObject, isRecordFresh } from '../../utils';

export interface GHButtonProps extends ButtonLinkProps {
  resource: {
    endpoint: string;
    attr: string;
  };
}

const GHButton: React.FC<GHButtonProps & LocalCache.Prop> = ({
  resource: { attr, endpoint },
  timeout = 10, // 10 mins
  ...btnProps
}) => {
  const [loading, setLoading] = useState(false);
  const [attrCountRecord, setAttrCountRecord] = useLocalStorageState<
    number | undefined
  >(attr, undefined);

  useEffect(() => {
    let isMounted = true;

    const fetchApi = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch(endpoint);
        if (!response.ok) {
          if (isMounted) setAttrCountRecord(buildRecordObject(undefined));
          return;
        }
        const json = await response.json();

        if (isMounted && json && typeof json[attr] === 'number') {
          setAttrCountRecord(buildRecordObject(json[attr]));
        } else if (isMounted) {
          setAttrCountRecord(buildRecordObject(undefined));
        }
      } catch {
        if (isMounted) setAttrCountRecord(buildRecordObject(undefined));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!isRecordFresh(attrCountRecord, timeout)) {
      fetchApi();
    }

    return () => {
      isMounted = false;
    };
  }, [attr, endpoint, timeout, attrCountRecord, setAttrCountRecord]);

  return (
    <ButtonLink
      {...btnProps}
      showCount={!loading && attrCountRecord?.data !== undefined}
      count={attrCountRecord?.data}
    />
  );
};

export default GHButton;
