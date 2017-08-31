# React Native Animations & Interactions Workshop

Welcome to our workshop on Animations and Interactions with React Native! :tada:

This readme contains everything you need to know to use this repository effectively for the
length of the workshop. This includes how to get started, some information on what this
repository is and how to work with it, and a transcript and steps of what we are going
through today.

This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

## Getting started

- Make sure you have Node v6 or later installed. No XCode or Android Studio installation is required.
- Install all dependencies if you haven't done so already with either `npm install` or `yarn`.
- To start the project you will need to run the `yarn start` (for npm of course: `npm start`) task.

Once the project is started using these instructions, it will run in development mode. Your terminal
will show you a QR code, which links to the development server.

Scan the code with the [Expo app](https://expo.io) on your phone to start the app. Your phone needs to be on the same WiFi network as your laptop. If you're not able to connect to the conference WiFi, you can also tether internet from your phone to your laptop.

Once connected, the app will reload if you save edits to your files, and you will see build errors and logs in the terminal.

Sometimes you may need to reset or clear the React Native packager's cache.
To do so, you can pass the `--reset-cache` flag to the start script:

```sh
npm start -- --reset-cache
# or
yarn start -- --reset-cache
```

### Using a simulator instead

As long as you have an iOS Simulator running you can use: `yarn run ios` to run it there.
Similarly for Android the command `yarn run android` will open the app on any connected Android device or emulator.

Visit the [React Native docs](https://facebook.github.io/react-native/docs/getting-started.html) for more detailed
instructions on how to set this up if you need to.

### Troubleshooting

By default the packager will choose a hostname as it sees fit. This can cause trouble when your desired iOS or Android
device can't reach the resulting URL. By default you'll see a URL that will look similar to this one:
`exp://192.168.0.2:19000`

Even when you type in a different URL with a hostname that can reach your machine, the bundler will tell the Expo app
to load the JavaScript bundle from this fixed URL.

To change this you will have to pass your own hostname in the `REACT_NATIVE_PACKAGER_HOSTNAME` environment variable,
like so:

Mac and Linux:

```
REACT_NATIVE_PACKAGER_HOSTNAME='my-custom-ip-address-or-hostname' npm start
```

Windows:
```
set REACT_NATIVE_PACKAGER_HOSTNAME='my-custom-ip-address-or-hostname'
npm start
```

The above example would cause the development server to listen on `exp://my-custom-ip-address-or-hostname:19000`.

More troubleshooting can be found [here](/docs/troubleshooting.md).

## Goals

Today we are going to build a Tinder-like UI that allows us to convey our love or hate for popular TV series.
It will be possible to "dismiss" cards left or right, by either pressing the corresponding buttons, or swiping
them left or right manually:

![Result of today's workshop](/docs/result.gif?raw=true)

This workshop is divided into 5 steps. The first step (`step-0`) will be our starting point which already contains the basic,
but motionless and stiff UI, and in each subsequent step we will add more functionality and learn about some new APIs
and concepts.

We encourage improvisation and helping each other out! :tada: Don't worry if you're stuck, we're here to help.
Every step furthermore has a corresponding branch in this repository of the name `step-X` (e.g. `step-1`). So
don't worry if you get stuck, you can always skip ahead as a last resort.

To jump to a specific step, do:
```sh
# Discard your local changes! (You'll lose all uncommitted work)
git checkout .

# Change to new branch
git checkout step-1
```

Here's a quick summary of what each step will be about:

0. This will be where we'll start from. The basic UI is already implemented and includes: The buttons, the cards, the data
  and the container view itself. It doesn't have any logic or interactions however :disappointed: Let's change that!

1. We'll start off by adding the basic dismissal animation to our cards. We will make the buttons animate the card off-screen.

2. At this point we only have a single card, so let's add more! We'll now cycle through cards as we dismiss them and show the next
  card under the current one.

3. This is the moment we're excited for! We will use the `PanResponder` to tie the animation to gestures, so that we can also
  swiped cards to dismiss them.

4. Lastly, we will need to add a "release" for gestures, so the card actually slides off-screen, or snaps back into place.

Let's get started!

## Step 0

This is where we'll be starting from. All of our workshop will take place inside `/App.js`. For now this contains
a view with a single card and two buttons. The `Card` component is located at `src/components/Card.js` and accepts
an `image` and a `text` prop.

We've added some images and some data for our example app. The data is located at `src/data.js` and is an array of
objects with the `image` and `text` properties, thus matching what the `Card` component accepts.

### Intro to Animated

In the first step we'll create our first animation using React Native `Animated`!

With React Native `Animated` animations are expressed with the *observer pattern*. This means we'll need to put in two
things into our app: An `Animated.Value` and a special `Animated.View` component.

The `Animated.Value` holds a number that can be changed, transitioned using springs and timing functions, and attached
to events. It's effectively like an observable that notifies `Animated`'s special components when it changes.

The `Animated.View` is a component we will use that is basically like a normal `View` component. It's special because
it searches through the stylesheet that you pass it and finds `Animated.Value`s. It then subscribes to your values and
changes its styling on-the-fly as the value changes. There are also more shorthands (of the form `Animated.COMPONENT`)
and also a factory so that you can create custom ones.

This is a powerful pattern with two advantages:

- You don't have to update any components or styling manually. They stay constant and the actual changing numbers in your
  component are wrapped inside `Animated.Value`s.

- How an animation is rendered is abstracted to the `Animated` components. This means you won't have to dramatically optimise
  anything or worry about how `Animated` actually rerenders behind the scenes.

## Step 1

<details>
  <summary>Click to open this section when you're ready to start Step 1</summary>
  
### Changes

Let's not forget to import `Animated` from `react-native` first.

First we'll need to wrap the `<Card />` element inside an `<Animated.View>`; We also need to create an `Animated.Value`
that will control it later on. For that we can add an instance to the class, for example:

```js
// 0 is the initial value:
position = new Animated.Value(0);
```

Now we want the value to represent the position of the card horizontally. For that we want `-1` to mean "shift this
view `{window width}` to the left" and `+1` to mean "shift this view `{window width}` to the right".

First, we'll need to know how wide the user's window (viewport / device screen) is. For that let's create a constant
at the top of our file:

```js
// Don't forget to import Dimensions from react-native
const SWIPE_DISTANCE = Dimensions.get('window').width;
```

Now, because we want the `Animated.Value` to range from `-1` to `+1`, we'll need to **interpolate** it to range from
`-SWIPE_DISTANCE` to `+SWIPE_DISTANCE` instead. To do this we'll use the `Animated.Value#interpolate` method. It takes
an input range and an output range and automagically interpolates the value to map to the value we need:

```js
const translateX = this.position.interpolate({
  inputRange: [-1, 1],
  outputRange: [-SWIPE_DISTANCE, SWIPE_DISTANCE]
});
```

This doesn't mutate/modify the original `Animated.Value` but instead wraps around it, creating a new value tracking the
`position` value we created earlier. Neat!

> Note: For our example code we'll just put these variables into the `render()` method, but feel free to make them instances on
> your class as well, which could make performance refactors by preventing unnecessary rerenders easier in the future.

Now that we have the `translateX` value in place, we can create the styles for the `<Animated.View>`
we added earlier. Let's create a styled-object and pass it to the `<Animated.View style={}>` prop.
We can just treat `translateX` like a normal value and put it in the same place in a stylesheet:

```js
const animatedStyle = {
  transform: [{ translateX: translateX }]
};
```

Now passing this to our view we get: `<Animated.View style={animatedStyle}>`. And we're already halfway done with this step!

This looks pretty, but nothing is actually happening as the value is not changing. Let's *change* that. Ha!

We'll want to add two methods and pass them as `onPress` handlers to our two buttons: `<Button onPress={} /* ... */ />`.
In our example code we called them `yepPressed` and `nopePressed`.

And in them we'll use `Animated.timing` to start our animations, like so:

```js
// For nopePressed the only change is that we've swapped out the 1 with -1
yepPressed = () => {
  Animated.timing(this.position, {
    toValue: 1
  }).start();
};
```

Notice that for all the callback functions in our component, we are using the function property syntax `method = () => {}`, instead of the class method syntax `method() {}`. This will automatically bind the `this` context correctly, so that we can access properties like `this.position` inside it!

`Animated.timing` is used to transition an `Animated.Value` to a new value using an easing function. This particular method also
accepts more options, like `duration`.
[Check out the RN docs for more options if you'd like](https://facebook.github.io/react-native/docs/animated.html#timing)

Now you should end up with the card animating left and right, moving off-screen as you press the buttons. For our final touch-up
in this step we will add a slight rotation as they reach the edge of the screen, for that satisfying "Tinder-card-feel".

For that create another interpolation below the `translateX` one—we called it `rotate`—and interpolate from `'-30deg'` to `'30deg'`,
like so:

```js
// ...

const rotate = this.position.interpolate({
  inputRange: [-1, 1],
  outputRange: ['-30deg', '30deg']
});

const animatedStyle = {
  transform: [{ translateX: translateX, rotate: rotate }]
};
```

And now that we've added this to the `animatedStyle` styles as well, we'll see that the cards make a slight rotation as they
move! :sparkles:

[Once you're done you can check our reference solution here.](https://github.com/FormidableLabs/react-native-animation-workshop/compare/step-0...step-1)

### What we've learned about

- `Animated.Value`
- `Animated.View`
- `Animated.Value#interpolate`
- `Animated.timing`

</details>

## Step 2

<details>
  <summary>Click to open this section when you're ready to start Step 2</summary>

### Changes

In this step we'll display a second card underneath the "current" one, and cycle through to the next pair of cards when, the current one
is dismissed, i.e. moved off the screen.

First instead of just retrieving one item from our array we'll need to get the next one as well:

```js
const [item, next] = this.state.items;
```

Then let's add a second card to our elements. It's important this element is declared *before* the card, so it'll be rendered underneath the topmost one:

```js
<Animated.View key={next.text}>
  <Card image={next.image} text={next.text} />
</Animated.View>
```

We'll also need to add the `key` prop, so that React knows precisely which elements need to be swapped out at all times. The key can be any unique value - here we are using the card's `text` property, since it will be different for each card.

Two display both cards on top of each other we can add a new entry to our `styles` StyleSheet:

```js
const styles = StyleSheet.create({
  // ...
  card: {
    position: 'absolute'
  }
});
```

And then we can add it to both `<Animated.View>`s:

```js
// The other one will already contain our animatedStyle which we added in the last step
<Animated.View style={[ styles.card ]} key={/*...*/}>
```

We now want the next card to be a little smaller than the current one, and scale into place
when the current one moves off the screen. Luckily we can still reuse the same old `this.position`
value that we've created, and just add a new interpolation.

```js
// We've already played around and come up with this interpolation, but of course feel free to
// play around and come up with your own
const nextScale = this.position.interpolate({
  inputRange: [-1, -0.2, 0.2, 1],
  outputRange: [1, 0.75, 0.75, 1]
});
```

This describes that we want the next card to be 75% as big as the current one, and after we tell
the current card to move 20% from the center, we want it to linearly scale to its full size.

As we've done for the current card already, let's create a new style-object:

```js
const nextCardStyle = {
  transform: [{ scale: nextScale }]
};
```

And add it to the `<Animated.View style={[]}>` prop:

```js
<Animated.View key={next.text} style={[ styles.card, nextCardStyle ]}>
```

As you can see, we now have the desired, second card, and it starts scaling into place as the second
one moves off the screen. But after it is still stuck in place, since we haven't added any logic yet,
to switch to the next pair of cards. Let's do just that!

The `.start()` on our animations actually takes an argument. This is a callback that is called once
the animation stops. We can thus change our two button handlers to call a method once we're done:

```js
yepPressed = () => {
  Animated.timing(this.position, {
    toValue: 1
  }).start(this.moveToNext);
  // ^ don't forget to make this same change to the other button handler e.g. nopePressed
};
```

And let's promptly create the `moveToNext` method as well now that we're referring to it.
We want it to modify the state and move the first item to the end of the array. This will effectively
cycle our cards when it's called.

```js
moveToNext = () => {
  this.setState(prevState => {
    const [first, ...rest] = prevState.items;
    return {
      items: [...rest, first]
    };
  });
};
```

We also need to reset the `position` value to `0` so that the new card starts off at its resting
position in the middle of the screen again. For that we can call `this.position.setValue(0)` which
just changes our `Animated.Value`'s value, instead of transitioning it. 

We'll place this call as the second argument to `setState`, which is a callback that runs after
React has updated the state.

```js
moveToNext = () => {
  this.setState(prevState => {
    // ...
  }, () => {
    this.position.setValue(0);
  });
};
```

> Note: We've made the above callback its own method in our reference solution, called `resetPosition`.

You might have noticed that something weird is happening when you press the button too quickly, or
if you press both buttons repeatedly. Our `moveToNext` callback is called even though a new animation
is supposed to run.

`Animated` supports the cancellation of ongoing animations, so it will abort the running animation
properly and start the next one, but nonetheless it will call the callback to signal that the animation
has been stopped. So we need to know whether our animation actually *finished* rather than it having
been *cancelled*.

To make this special case possible, your callback actually receives an object that tells you whether your
animation finished: `{ finished: boolean }`. So let's prevent our `moveToNext` callback from showing the
next pair of cards, when the animation didn't finish:

```js
moveToNext = ({ finished }) => {
  if (!finished) {
    return;
  }

  // ...
};
```

And now you'll see that you can gloriously work yourself through the cards, as we've planned all along!

#### Bonus: Spring Animations!

If you're familiar with `react-motion` by any chance, you will know that springs for animations have a lot
of advantages to timing functions. If we apply the physics of springs to animations, cancelling animations
won't be as harsh. Instead of one animation ending and another starting off immediately, a spring will
take the *impulse* into account. This can make changing animations on-the-fly look a lot smoother!

We should try the same with our cards, since we've just noticed that we can cancel animations. All we need
to do is change our button handlers (`yupPressed` and `nopePressed`) to use `Animated.spring` instead
of `Animated.timing`:

```diff
// Same change for both handlers
yepPressed = () => {
-  Animated.timing(this.position, {
+  Animated.spring(this.position, {
+   friction: 11,
+   tension: 60,
    toValue: 1
  }).start(this.moveToNext);
};
```

We've already chosen some nice parameters for the spring animation, but
[you can take a look at the RN docs to find out how to choose your own.](https://facebook.github.io/react-native/docs/animated.html#spring)

And that's all for **Step 2**. We now have implemented logic and animations for our two buttons.

[Once you're done you can check our reference solution here.](https://github.com/FormidableLabs/react-native-animation-workshop/compare/step-1...step-2)

### What we've learned about

- `Animation#start(cb)`
- `Animated.Value#setValue`
- `Animated.spring`

</details>

## Step 3

<details>
  <summary>Click to open this section when you're ready to start Step 3</summary>
  
### Changes

What is this even?! We want to swipe stuff! In this step we'll add a `PanResponder` so that we can actually swipe
the cards, instead of only being able to press the buttons.

First we will need to import the `PanResponder` class from `react-native` and instantiate it on our component class:

```js
panResponder = PanResponder.create({
  onStartShouldSetPanResponder: () => true,
  onMoveShouldSetPanResponder: () => true,
  onPanResponderMove: Animated.event([null, { dx: this.position }])
});
```

The first two functions tell our `PanResponder` to be the responder for the incoming events. More information on this
can be found [in the React Native docs](https://facebook.github.io/react-native/docs/panresponder.html).

The third property `onPanResponderMove` is a callback that fires when we'll drag the card. We're using `Animated.event`
which creates a handler that automatically sets the incoming values on our `position` value.
The array that it accepts is a mapping of the event's arguments. Basically the object in the second position is telling it that
the `dx` property on the second argument's object should be applied to our `position` value.

More information on that function [can also be found in the docs](https://facebook.github.io/react-native/docs/animated.html#event).

Next we'll need to apply our `PanResponder`'s event handlers to our `<Animated.View>` that is wrapping the current card:

```diff
-<Animated.View key={item.text} style={[styles.card, animatedStyle]}>
+<Animated.View
+  key={item.text}
+  style={[styles.card, animatedStyle]}
+  {...this.panResponder.panHandlers}
+>
  <Card image={item.image} text={item.text} />
</Animated.View>
```

As you'll now notice, instead of our `position` value ranging from `-1` to `+1`, its range will span the entire screen width. This
is because in the `PanResponder` we're applying `dx`. It stands for the movement in pixels of the touch interaction, which is
of course not a factor of the screen size but just a pixel value. So it will now have the approximate range of
`-SWIPE_DISTANCE` to `+SWIPE_DISTANCE`.

Our interpolations in the `render()` method all assume the `[-1, +1]` range, so we will need to adapt `translateX`, `rotate`,
and `nextScale` to the new range.

The first one, `translateX`, is easy to change. Before we were interpolating it to `SWIPED_DISTANCE`! That means we can now remove
this interpolation entirely:

```diff
-const translateX = this.position.interpolate({
-  inputRange: [-1, +1],
-  outputRange: [-SWIPE_DISTANCE, SWIPE_DISTANCE]
-});
+const translateX = this.position;
```

The other two though will need an actual change. Optimally we'd want to divide the `position` value by `SWIPE_DISTANCE`, so that the
resulting value is between `-1` and `+1` again. Luckily `Animated` comes [with some math functions](https://facebook.github.io/react-native/docs/animated.html#divide).
One of them is `Animated.divide`, which we can apply to our other two values to get the desired result:

```diff
-const rotate = this.position.interpolate({
+const rotate = Animated.divide(this.position, SWIPE_DISTANCE).interpolate({

...

-const nextScale = this.position.interpolate({
+const nextScale = Animated.divide(this.position, SWIPE_DISTANCE).interpolate({
```

That doesn't look half bad, does it? Unfortunately we'll now also need to fix our button handlers. As you recall they're animating to `-1` and `1`
respectively, so we'll need to change that to `SWIPE_DISTANCE` too:

```js
yepPressed = () => {
  Animated.spring(this.position, {
    // ...
    toValue: SWIPE_DISTANCE // Don't forget to change the other handler too
  }).start(this.moveToNext);
};
```

The only thing that's missing now is, similarly to the animations before, that we need to finish the animation
and cycle to the next pair of cards, when the card is released after swiping it. We will implement this in the next step.

[Once you're done you can check our reference solution here.](https://github.com/FormidableLabs/react-native-animation-workshop/compare/step-2...step-3)

### What we've learned about

- `PanResponder#create`
- `Animated.event`
- `Animated.divide`

</details>

## Step 4

<details>
  <summary>Click to open this section when you're ready to start Step 4</summary>
  
### Changes

As mentioned before, when we release the card after swiping it, it just stays where it is. Instead we'd like to introduce a threshold. When the threshold
was crossed the card should move off the screen, when it wasn't it should bounce back to its resting position to the middle of the screen.

To do this we can add the `onPanResponderRelease` callback to our `PanResponder`:

```js
panResponder = PanResponder.create({
  // ...
  onPanResponderRelease: (e, { dx, vx }) => {
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      // TODO 1
    } else {
      // TODO 2
    }
  }
});
```

We are going to use `dx` again, the accumulated, horizontal movement of the gesture, and we'll also use `vx` which is the current velocity, from the
time the user releases the card. Based on `dx` we'd like to decide whether the threshold was crossed. In our reference solution we're defining
`SWIPE_THRESHOLD` to be a third of the user's screen width:

```js
const SWIPE_DISTANCE = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SWIPE_DISTANCE / 3;
```

The `else` case now needs to move the card back to the middle of the screen. Let's use `Animated.spring` again to do this:

```js
// Inside else for "TODO 2"
Animated.spring(this.position, {
  toValue: 0,
  friction: 4
}).start();
```

For the other case however, we'd like to move the card off screen. This needs to feel *natural* however. In a Tinder-like UI the card continues with
the same speed onwards, as the user releases it, but slows down continuously until it's out of view.

`Animated` has an API for this once again! It's called `Animated.decay` and it takes a velocity and a `deceleration` parameter.
Before we use it however we need to know two things:

- What's the velocity of the card when the user releases it?
- Which direction is it moving towards?

Both questions can be answered using the `vx` value, mentioned earlier. It described just what we need. We'll also want to define a *minimum velocity*
so that the card won't be stuck on the screen or move sluggish.

```js
// Inside if for "TODO 1"
const direction = dx > 0 ? 1 : -1;
// Here we're setting a minimum speed of 2.5:
const velocity = Math.max(2.5, Math.abs(vx)) * direction;

Animated.decay(this.position, {
  velocity,
  deceleration: 0.985
}).start(this.moveToNext);
```

Note that we're also adding `this.moveToNext` here again, so that we cycle to the next card.

After implementing this change you'll get the "full Tinder experience"! :tada: But you might notice that
the `decay` might move the value farther than just `SWIPE_DISTANCE` as it doesn't have an upper limit.
This is not a big problem for the card, but it affects the card's rotation and the next card's scale.

To fix this let's limit the `rotate` and `nextScale` interpolation, with an option we haven't shown you yet, `extrapolate`:

```diff
const rotate = Animated.divide(this.position, SWIPE_DISTANCE).interpolate({
  // ...
+  extrapolate: 'clamp'
});

// ...

const nextScale = Animated.divide(this.position, SWIPE_DISTANCE).interpolate({
  // ...
+  extrapolate: 'clamp'
});
```

This option tells the interpolation that instead of continuing the interpolation past the upper and lower numbers,
it should just clamp them. And... That's it!

**Hooray!**

[Once you're done you can check our reference solution here.](https://github.com/FormidableLabs/react-native-animation-workshop/compare/step-3...step-4)

### What we've learned about

- `onPanResponderRelease`
- `Animated.decay`

### Wrap up

[You can find our final reference solution here on the `step-4` branch](https://github.com/FormidableLabs/react-native-animation-workshop/blob/step-4/App.js)

</details>

## Learn more

This course has scratched the surface of what you can do with React Native animations. We haven't covered [LayoutAnimation](https://facebook.github.io/react-native/docs/animations.html#layoutanimation-api), or useful third-party libraries like [react-native-interactable](https://github.com/wix/react-native-interactable) (a full-fledged physics engine!) or [react-native-animatable](https://github.com/oblador/react-native-animatable) (pre-packaged Animated configurations as declarative components!)

If you're looking to ramp up your team on React Native, animations and otherwise, [book a customized training session](http://formidable.com/services/training/) with Formidable (available in the US, UK and EU).

To dive deeper in animations by yourself, take a look at Jason Brown's [React Native Animations online course](https://reactnativeanimations.com).
