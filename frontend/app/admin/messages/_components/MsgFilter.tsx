import { Badge } from '@/components/ui/badge';
import React from 'react';

const MsgFilter = () => {
    return (
        <div className="flex items-center justify-center gap-4 mt-2">
            <span className={"font-semibold text-xs"}>Filters : </span>
            <Badge variant={"secondary"} > All </Badge>
            <Badge variant={"destructive"} > Open </Badge>
            <Badge variant={"default"} > Answered </Badge>
            <Badge variant={"outline"} > Closed </Badge>
        </div>
    );
};

export default MsgFilter;
