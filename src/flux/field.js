// @flow

import schema from 'reducers/schema';
import {
    getCellNeighbours,
    IS_OPENED_BIT_FLAG,
    IS_BOMB_BIT_FLAG,
    IS_DEAD_BIT_FLAG,
    IS_FLAG_BIT_FLAG,
    IS_UNKNOWN_BIT_FLAG,
    IS_EVERYTHING_BIT_FLAG,
} from 'helpers/utils';
import {
    FIELD_FILL,
    FIELD_FILL_EMPTY,
    FIELD_OPEN,
    FIELD_MARK,
    FIELD_QUICK_OPEN,
} from './constants';
import fieldGenerator, {fieldGeneratorEmpty} from 'helpers/field-generator';
import type {FieldType, FieldStoreType, FieldFillParams} from 'flux/types';

const updateCell = (field: FieldType, id: number, add: number, remove = IS_EVERYTHING_BIT_FLAG): FieldType => {
    field = new Uint16Array(field);
    field[id] |= add;
    field[id] &= remove;
    return field;
};

const openAllowedSiblings = (state: FieldStoreType, id: number): FieldStoreType => {
    const width = state.rowWidth;
    const size = state.field.length;

    const openFieldCell = (id: number) => {
        if (state.field[id] & IS_OPENED_BIT_FLAG) {
            return;
        }

        state = {
            ...state,
            field: updateCell(state.field, id, IS_OPENED_BIT_FLAG),
            openedCount: state.openedCount + 1,
        };

        if ((state.field[id] >> 8) === 0) {
            for (const i of getCellNeighbours(id, width, size)) {
                openFieldCell(i);
            }
        }
    };

    openFieldCell(id);

    return state;
};

const openCellState = (state: FieldStoreType, id: number): FieldType => {
    if (state.field[id] & IS_OPENED_BIT_FLAG) {
        return state;
    }

    state = {
        ...state,
        field: updateCell(state.field, id, IS_OPENED_BIT_FLAG),
        openedCount: state.openedCount + 1,
    };

    if (state.field[id] & IS_BOMB_BIT_FLAG) {
        return {
            ...state,
            field: updateCell(state.field, id, IS_DEAD_BIT_FLAG),
            showAllBombs: true,
        };
    }

    return state;
};

export const openCell = (id: number) =>
    ({type: FIELD_OPEN, id});

export const markCell = (id: number) =>
    ({type: FIELD_MARK, id});

export const quickOpen = (id: number) =>
    ({type: FIELD_QUICK_OPEN, id});

export const fill = (field: FieldFillParams, id: number) =>
    ({type: FIELD_FILL, field, id});

export const fillEmpty = (field: FieldFillParams) =>
    ({type: FIELD_FILL_EMPTY, field});

const getDefaultState = (): FieldType =>
    schema.field;


type ActionType = {
    id: number,
    type: string,
    field: FieldType,
};

type ActionsType = {
    [string]: (FieldStoreType, ActionType) => FieldStoreType,
};

const actions: ActionsType = {
    [FIELD_FILL](state: FieldStoreType, {field, id}: ActionType) {
        return {
            ...schema.field,
            isGenerated: true,
            field: fieldGenerator(field.width, field.height, field.minesCount, id),
            rowWidth: field.width,
        };
    },

    [FIELD_FILL_EMPTY](state: FieldStoreType, {field}: ActionType) {
        return {
            ...schema.field,
            field: fieldGeneratorEmpty(field.width, field.height),
            rowWidth: field.width,
        };
    },

    [FIELD_OPEN](state: FieldStoreType, action: ActionType) {
        const cell = state.field[action.id];

        if ((cell >> 8) === 0 && !(cell & IS_BOMB_BIT_FLAG)) {
            return openAllowedSiblings(state, action.id);
        }

        return openCellState(state, action.id);
    },

    [FIELD_MARK](state: FieldStoreType, {id}: ActionType) {
        const cell = state.field[id];

        if (cell & IS_UNKNOWN_BIT_FLAG) {
            return {
                ...state,
                field: updateCell(state.field, id, 0, ~IS_UNKNOWN_BIT_FLAG),
            };
        } else if (cell & IS_FLAG_BIT_FLAG) {
            return {
                ...state,
                field: updateCell(state.field, id, IS_UNKNOWN_BIT_FLAG, ~IS_FLAG_BIT_FLAG),
                flagsCount: state.flagsCount - 1,
            };
        }

        return {
            ...state,
            field: updateCell(state.field, id, IS_FLAG_BIT_FLAG),
            flagsCount: state.flagsCount + 1,
        };
    },

    [FIELD_QUICK_OPEN](state: FieldStoreType, {id}: ActionType) {
        const cell = state.field[id];

        if ((cell & IS_OPENED_BIT_FLAG) && ((cell >> 8) !== 0)) {
            let countFlagsAround = 0;
            const neighbours = getCellNeighbours(id, state.rowWidth, state.field.length);

            const emptyCells = neighbours.filter((id) => {
                const cell = state.field[id];

                if (cell & IS_FLAG_BIT_FLAG) {
                    countFlagsAround++;

                    return false;
                }

                if ((cell & (IS_OPENED_BIT_FLAG | IS_UNKNOWN_BIT_FLAG)) === 0) {
                    return true;
                }

                return false;
            });

            if (countFlagsAround === cell >> 8) {
                emptyCells.forEach((id) => {
                    if ((state.field[id] >> 8) === 0 && !(state.field[id] & IS_BOMB_BIT_FLAG)) {
                        state = openAllowedSiblings(state, id);
                    } else {
                        state = openCellState(state, id);
                    }
                });
            }
        }

        return state;
    },
};

export default (state: FieldStoreType = getDefaultState(), action: ActionType) => {
    if (actions[action.type]) {
        return actions[action.type](state, action);
    }

    return state;
};
