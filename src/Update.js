import * as R from 'ramda';

const MSGS = {
  SHOW_FORM: 'SHOW_FORM',
  FRONT_INPUT: 'FRONT_INPUT',
  BACK_INPUT: 'BACK_INPUT',
  SAVE_FRONT: 'SAVE_FRONT',
  DELETE_CARD: 'DELETE_CARD',
  UPDATE_BACK: 'UPDATE_BACK',
  SAVE_BACK: 'SAVE_BACK'
};

export function showFormMsg(showForm) {
  return {
    type: MSGS.SHOW_FORM,
    showForm,
  };
}

export function frontInputMsg(description) {
  return {
    type: MSGS.FRONT_INPUT,
    description,
  };
}

export function backInputMsg(back) {
  return {
    type: MSGS.BACK_INPUT,
    back,
  };
}

export const saveFrontMsg = { type: MSGS.SAVE_FRONT };
export const saveBackMsg = { type: MSGS.SAVE_BACK };

export function deleteCardMsg(id) {
  return {
    type: MSGS.DELETE_CARD,
    id,
  };
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.SHOW_FORM: {
      const { showForm } = msg;
      return { ...model, showForm, description: '', };
    }
    case MSGS.FRONT_INPUT: {
      const { description } = msg;
      return { ...model, description };
    }
    case MSGS.BACK_INPUT: {
      const { back } = msg;
      return { ...model, back };
    }
    case MSGS.SAVE_FRONT: {
      const updatedModel = add(msg, model);
      return updatedModel;
    }
    case MSGS.SAVE_BACK: {
      const updatedModel = add(msg, model);
      return updatedModel;
    }
    case MSGS.DELETE_CARD: {
      const { id } = msg;
      const cards = R.filter(
        card => card.id !== id
      , model.cards);
      return { ...model, cards };
    }
    case MSGS.UPDATE_BACK: {
      const { description } = msg;
      return { ...model, description };
    }
  }
  return model;
}

function add(msg, model) {
  const { nextId, description, back } = model;
  const card = { id: nextId, description, back };
  const cards = [...model.cards, card]
  return {
    ...model,
    cards,
    nextId: nextId + 1,
    description: '',
    back: '',
    showForm: false,
  };
}

export default update;