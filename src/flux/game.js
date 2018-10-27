// @flow

import schema from 'reducers/schema';
import immutable from 'immutability-helper';

import {
    GAME_SET_WIDTH, GAME_SET_HEIGHT, GAME_SET_MINES_COUNT, GAME_START,
    GAME_RESET, GAME_FINISH,
} from 'flux/constants';
import type {GameType} from 'flux/types';

const getDefaultState = (): GameType =>
    schema.game;

export const updateWidth = (value: number) =>
    ({type: GAME_SET_WIDTH, value});

export const updateHeight = (value: number) =>
    ({type: GAME_SET_HEIGHT, value});

export const updateMinesCount = (value: number) =>
    ({type: GAME_SET_MINES_COUNT, value});

export const start = () =>
    ({type: GAME_START});

export const finish = (isFail: boolean) =>
    ({type: GAME_FINISH, isFail});

export const reset = () =>
    ({type: GAME_RESET});

export default (state: GameType = getDefaultState(), {type, value, isFail}: any) => {
    switch (type) {
        case GAME_SET_WIDTH:
            return immutable(state, {width: {$set: value}});

        case GAME_SET_HEIGHT:
            return immutable(state, {height: {$set: value}});

        case GAME_SET_MINES_COUNT:
            return immutable(state, {minesCount: {$set: value}});

        case GAME_RESET:
            return immutable(state, {state: {$set: 'not-started'}});

        case GAME_FINISH:
            return immutable(state, {state: {$set: isFail ? 'fail' : 'win'}});

        case GAME_START:
            return immutable(state, {state: {$set: 'in-progress'}});
    }

    return state;
};
