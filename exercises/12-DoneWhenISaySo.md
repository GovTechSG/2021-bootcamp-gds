# 1.2 Done When I Say So

[Back to Exercises ](./README.md) | [Next Exercise >](./13-StretchGoals.md)

Visual feedback is an important way of communicating with the user.

> As a user, I would want be able to check the items so that i can track the state of each item in the to do list

In this exercise, we will add a check box for each item to the Todo application.

---

## Adding a Checkbox

Lets start by adding a input checkbox
```tsx
<input type="checkbox"></input>
```
This checkbox should be placed in line with the item name display for easier reference

```tsx
return (<>
    <tr>
      <td>/* Insert checkbox here */</td>
      <td width={'100%'}>{props.name}</td>
    </tr>
  </>
);
```
Here we are using default html input tag with the checkbox type

---

## Creating a state for each checkbox

With the checkbox create we will want to keep track of the state when checkbox is click to done. With that we will need to initialize a state
```tsx
const [done, setDone] = useState(props.done);
```
Here we are initializing a state for each item to the `done` variable and we are using the `props.done` from `TodoItemProps` which is a type defined for each todo item.

`setDone` provides us a setter method to update the state when we want to.

## Making use of Done state variable

Now lets make use of the state variable created to keep track of each checkbox being marked/unmarked

First we will need to hook a call to the `setDone` method when checkbox is being clicked/changed

```tsx
onChange={(event) => setDone(event.currentTarget.checked)}
```

Add `onChange` code above to the checkbox input that you have created. This will call the `setDone` method to update the `done` state every time the checkbox is clicked.
Now we will need to link the `done` state variable to the checkbox so that the state is reflected correctly as it is currently not being used.

```tsx
checked={done}
```

Add the above to the checkbox input you created. This would ensure that the checkbox input is reflecting using the `done` state variable.

You should be seeing a similar block of code as below

```tsx
 <td><input type="checkbox" /* Insert code here */></input></td>
```

## Persist the checkbox state

Now try refreshing the page and you will realise that although you can check the box but upon refresh the state is not persistent. So the next thing we have to do is to persist the state through back end means.

### When to update Backend

First we will need to track changes made for the checkbox for each item so that we know when to send the update to the back end and an easy way to do it in react is using the `useEffect` hook with dependencies `done` state variable.

To have visibility on the behaviour lets add `console.log` to display item name and done state variable.

```tsx
 useEffect(() => {
    /* Insert code here */
  }, [props.name, done]);
```

With `useEffect` when there are changes(updates) detected on any of the dependencies `[props.name, done]`. This method will be triggered.

To view the method being triggered, inspect and view console, you will see that every time the checkbox is clicked the console will be logged with the message. You will also be able to observed that each checkbox has its own state being stored.

### Time to update Backend

We have created the trigger point using `useEffect` to call and update the back end. Now we will just need ot link the backend api call with `useEffect`

```tsx
useEffect(() => {
    /* Console log code */
    /* Insert code here */
  }, [props.name, done, /* Insert code here */]);
```

By adding `updateTodoItem`, `useEffect` will always call for `updateTodoItem` method every time it detects a change in the `done` state variable.

Now to update `updateTodoItem` to use the done state variable

```tsx
const updateTodoItem = useCallback(async () => {
    await axios.put(`/api/todos/${props.id}`, {
      id: props.id,
      name: props.name,
      done: false /* Update false */,
    });
    }, [props.name, props.id/* Insert code here */]);
```

Congratulations, now your state is persisted and refreshing will no longer pose a problem.


[Back to Exercises ](./README.md) | [Solution](../solutions/12-DoneWhenISaySo.md) | [Next Exercise >](./13-StretchGoals.md)
