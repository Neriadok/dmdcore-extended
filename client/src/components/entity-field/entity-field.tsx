import { TextField } from '@mui/material';
import { t } from 'i18next';
import React from 'react';
import { EntityFieldProps } from './entity-field.interface';
import { CoreEntity } from '../../entities/core-entity';

function EntityField<T extends CoreEntity>({ fieldProps, entityName, field, entity }: EntityFieldProps<T>) {
    const [value, setValue] = React.useState(entity.value[field] || '');
    return (<TextField {...fieldProps}
        sx={{ width: '100%' }}
        className={`${entityName}-${field as any}`}
        label={t(`${entityName}.field-${field as any}`)}
        value={value}
        onChange={(e) => setNextValue(e)} />
    );

    function setNextValue(e: any) {
        const nextValue = e.target?.value;
        entity.next({ ...entity.value, [field]: nextValue });
        setValue(e.target?.value);
    }

}


export default EntityField;
