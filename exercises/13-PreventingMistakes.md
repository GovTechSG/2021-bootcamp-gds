# 1.4 Stretch Goals

>💡 If you haven't completed Exercise 1.2, get up to speed by switching to the `frontend/checkpoint-2` branch!

> `git checkout frontend/checkpoint-3`
> 
[Back to Exercises ](./README.md)


> As a user, I would want to ensure my Todo items are valid, before adding them into the list

In this exercise, we will add a simple form of validation on our inputs. 

Notice that currently, if you do not provide any inputs (empty field) and click submit, it goes through, adding an entry that is empty. We want to prevent such situations from occuring.

## Adding Validations

Let start by making sure our inputs are validated before we commit them. 

**Before** a Todo input is committed, we need to perform some from of checks. If the checks pass, we can proceed to commit it. Otherwise, we should alert the user.

Search for the location where this validation should be added (Hint: look at `submitNewTodo`).

---

[Back to Exercises ](./README.md) | [Solution](../solutions/13-PreventingMistakes.md) | [Next Exercise >](./14-StretchGoals.md)
