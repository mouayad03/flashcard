const hh = require("hyperscript-helpers");
const { h } = require("virtual-dom");
import * as R from "ramda";
const { showFormMsg, mealInputMsg, caloriesInputMsg, saveMealMsg, deleteMealMsg } = require("./Update");

const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded";

const { div, button, form, label, input, table, thead, tbody, tr, th, td, br } = hh(h);

function cell(tag, className, value) {
  return tag({ className }, value);
}

const tableHeader = thead([tr([cell(th, "text-left", "Cards")])]);

function mealRow(dispatch, className, meal) {
  return div({ className: "w-60 h-60 bg-amber-300 inline-block ml-2 text-ellipsis overflow-hidden" }, [
    cell(td, "px-1 py-2", meal.description),
    cell(td, "px-1 py-2 text-right", [
      button(
        {
          className: "hover:bg-gray-200 p-2 rounded",
          onclick: () => dispatch(deleteMealMsg(meal.id)),
        },
        "🗑"
      ),
    ]),
    button(
      { 
        className: "hover:bg-gray-200 text-sm underline ",
        onclick: () => dispatch()
      },
      "Show Answer"
      ),
    /*cell(td, "", [
      button(
        { 
          className: "bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded",
          onclick: () => dispatch()
        },
        "Bad"
      ),
      button(
        { 
          className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded ml-2",
          onclick: () => dispatch()
        },
        "Good"
      ),
      button(
        { 
          className: "bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-1 rounded ml-2",
          onclick: () => dispatch()
        },
        "Great"
      ),
    ])*/
  ]);
}

function totalRow(meals) {
  const total = R.pipe(
    R.map((meal) => meal.calories),
    R.sum
  )(meals);
  return tr({ className: "font-bold" }, [cell(td, "", "Total"), cell(td, "", total), cell(td, "", "")]);
}

function mealsBody(dispatch, className, meals) {
  const rows = R.map(R.partial(mealRow, [dispatch, "odd:bg-white even:bg-gray-100"]), meals);

  const rowsWithTotal = [...rows, totalRow(meals)];

  return tbody({ className }, rowsWithTotal);
}

function tableView(dispatch, meals) {
  if (meals.length === 0) {
    return div({ className: "pt-8 text-center" }, "No Cards yet... ");
  }
  return div({className: "" }, [
    tableHeader,
    mealsBody(dispatch, "", meals)
  ]);
}

function fieldSet(labelText, inputValue, placeholder, oninput) {
  return div({ className: "grow flex flex-col" }, [
    label({ className: "text-gray-700 text-sm font-bold mb-2" }, labelText),
    input({
      className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700",
      placeholder,
      type: "text",
      value: inputValue,
      oninput,
    }),
  ]);
}

function buttonSet(dispatch) {
  return div({ className: "flex gap-4 justify-end" }, [
    button(
      {
        className: `${btnStyle} bg-green-500 hover:bg-green-700`,
        type: "submit",
      },
      "Save"
    ),
    button(
      {
        className: `${btnStyle} bg-red-500 hover:bg-red-700`,
        type: "button",
        onclick: () => dispatch(showFormMsg(false)),
      },
      "Cancel"
    ),
  ]);
}

function formView(dispatch, model) {
  const { description, calories, showForm } = model;
  if (showForm) {
    return form(
      {
        className: "flex flex-col gap-4",
        onsubmit: (e) => {
          e.preventDefault();
          dispatch(saveMealMsg);
        },
      },
      [
        div({ className: "flex gap-4" }, [
          fieldSet("Frontcard", description, "Enter Frontcard text...", (e) => dispatch(mealInputMsg(e.target.value))),
          fieldSet("Backcard", calories || "", "Enter Backcard text...", (e) => dispatch(caloriesInputMsg(e.target.value))),
        ]),
        buttonSet(dispatch),
      ]
    );
  }
  return button(
    {
      className: `${btnStyle} max-w-xs`,
      onclick: () => dispatch(showFormMsg(true)),
    },
    "➕ Flashcard"
  );
}

function view(dispatch, model) {
  return div({ className: "flex flex-col" }, [formView(dispatch, model), tableView(dispatch, model.meals)]);
}

export default view;
