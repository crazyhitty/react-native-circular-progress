import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  AppState,
  Easing,
  View,
  ViewPropTypes
} from 'react-native';
import CircularProgress from './CircularProgress';
const AnimatedProgress = Animated.createAnimatedComponent(CircularProgress);

export default class AnimatedCircularProgress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fillAnimation: new Animated.Value(props.prefill)
    }
  }

  componentDidMount() {
    this.animate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fill !== this.props.fill) {
      this.animate();
    }
  }

  animate(toVal, dur, ease, onComplete) {
    const toValue = toVal || this.props.fill;
    const duration = dur || this.props.duration;
    const easing = ease || this.props.easing;
    let animatedValue = 0;

    if (onComplete) {
      this.state.fillAnimation.addListener((value) => {
        animatedValue = value.value;
      });
    }

    return Animated.timing(this.state.fillAnimation, {
      toValue,
      easing,
      duration,
    }).start(() => {
      this.state.fillAnimation.removeAllListeners();
      if(onComplete) {
        // Whenever animation completes, provide the last animated value with it.
        // This value might not be equal to "toValue" if this animation was interrupted(cancel/reset).
        onComplete(animatedValue);
      } else if (this.props.onAnimationComplete) {
        this.props.onAnimationComplete();
      }
    });
  }

  render() {
    const { fill, prefill, ...other } = this.props;

    return (
      <AnimatedProgress
        {...other}
        fill={this.state.fillAnimation}
      />
    );
  }
}

AnimatedCircularProgress.propTypes = {
  ...CircularProgress.propTypes,
  prefill: PropTypes.number,
  duration: PropTypes.number,
  easing: PropTypes.func,
  onAnimationComplete: PropTypes.func,
};

AnimatedCircularProgress.defaultProps = {
  duration: 500,
  easing: Easing.out(Easing.ease),
  prefill: 0,
};
