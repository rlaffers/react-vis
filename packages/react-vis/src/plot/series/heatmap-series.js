// Copyright (c) 2016 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';

import Animation from 'animation';
import {ANIMATED_SERIES_PROPS} from 'utils/series-utils';
import {getCombinedClassName} from 'utils/styling-utils';

import AbstractSeries from './abstract-series';

const predefinedClassName = 'rv-xy-plot__series rv-xy-plot__series--heatmap';

class HeatmapSeries extends AbstractSeries {
  static getParentConfig(attr) {
    const isDomainAdjustmentNeeded = attr === 'x' || attr === 'y';
    return {isDomainAdjustmentNeeded};
  }

  render() {
    const {
      animation,
      className,
      data,
      marginLeft,
      marginTop,
      style
    } = this.props;
    if (!data) {
      return null;
    }
    if (animation) {
      return (
        <Animation {...this.props} animatedProps={ANIMATED_SERIES_PROPS}>
          <HeatmapSeries {...this.props} animation={null} />
        </Animation>
      );
    }
    const {rectStyle} = {rectStyle: {}, ...style};
    const x = this._getAttributeFunctor('x');
    const y = this._getAttributeFunctor('y');
    const opacity = this._getAttributeFunctor('opacity');
    const fill =
      this._getAttributeFunctor('fill') || this._getAttributeFunctor('color');
    const stroke =
      this._getAttributeFunctor('stroke') || this._getAttributeFunctor('color');
    const xDistance = this._getScaleDistance('x');
    const yDistance = this._getScaleDistance('y');
    return (
      <g
        className={getCombinedClassName(predefinedClassName, className)}
        transform={`translate(${marginLeft},${marginTop})`}
      >
        {data.map((d, i) => {
          const attrs = {
            style: {
              stroke: stroke && stroke(d),
              fill: fill && fill(d),
              opacity: opacity && opacity(d),
              ...style
            },
            ...rectStyle,
            x: x(d) - xDistance / 2,
            y: y(d) - yDistance / 2,
            width: xDistance,
            height: yDistance,
            onClick: e => this._valueClickHandler(d, e),
            onContextMenu: e => this._valueRightClickHandler(d, e),
            onMouseOver: e => this._valueMouseOverHandler(d, e),
            onMouseOut: e => this._valueMouseOutHandler(d, e)
          };
          return <rect key={i} {...attrs} />;
        })}
      </g>
    );
  }
}

HeatmapSeries.propTypes = {
  ...AbstractSeries.propTypes
};

HeatmapSeries.displayName = 'HeatmapSeries';

export default HeatmapSeries;
