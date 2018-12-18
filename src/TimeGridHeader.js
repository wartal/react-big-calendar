import PropTypes from 'prop-types'
import cn from 'classnames'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import React from 'react'

import dates from './utils/dates'
import Header from './Header'
import { notify } from './utils/helpers'
import DefaultTimeGridResourceHeader from './TimeGridResourceHeader'

class TimeGridHeader extends React.Component {
  static propTypes = {
    range: PropTypes.array.isRequired,
    events: PropTypes.array.isRequired,
    resources: PropTypes.object,
    getNow: PropTypes.func.isRequired,
    isOverflowing: PropTypes.bool,

    rtl: PropTypes.bool,
    width: PropTypes.number,

    localizer: PropTypes.object.isRequired,
    accessors: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
    getters: PropTypes.object.isRequired,

    selected: PropTypes.object,
    selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),
    longPressThreshold: PropTypes.number,

    onSelectSlot: PropTypes.func,
    onSelectEvent: PropTypes.func,
    onDoubleClickEvent: PropTypes.func,
    onDrillDown: PropTypes.func,
    getDrilldownView: PropTypes.func.isRequired,
    scrollRef: PropTypes.any,
  }

  handleHeaderClick = (date, view, e) => {
    e.preventDefault()
    notify(this.props.onDrillDown, [date, view])
  }

  renderHeaderCells(range) {
    let {
      localizer,
      getDrilldownView,
      getNow,
      getters: { dayProp },
      components: { header: HeaderComponent = Header },
    } = this.props

    const today = getNow()

    return range.map((date, i) => {
      let drilldownView = getDrilldownView(date)
      let label = localizer.format(date, 'dayFormat')

      const { className, style } = dayProp(date)

      let header = (
        <HeaderComponent date={date} label={label} localizer={localizer} />
      )

      return (
        <div
          key={i}
          style={style}
          className={cn(
            'rbc-header',
            className,
            dates.eq(date, today, 'day') && 'rbc-today'
          )}
        >
          {drilldownView ? (
            <a
              href="#"
              onClick={e => this.handleHeaderClick(date, drilldownView, e)}
            >
              {header}
            </a>
          ) : (
            <span>{header}</span>
          )}
        </div>
      )
    })
  }

  render() {
    let {
      width,
      rtl,
      resources,
      range,
      accessors,
      components,
      scrollRef,
      isOverflowing,
      components: { timeGutterHeader: TimeGutterHeader },
    } = this.props

    let style = {}
    if (isOverflowing) {
      style[rtl ? 'marginLeft' : 'marginRight'] = `${scrollbarSize()}px`
    }

    let TimeGridResourceHeader =
      components.timeGridResourceHeader || DefaultTimeGridResourceHeader

    return (
      <div
        style={style}
        ref={scrollRef}
        className={cn('rbc-time-header', isOverflowing && 'rbc-overflowing')}
      >
        <div
          className="rbc-label rbc-time-header-gutter"
          style={{ width, minWidth: width, maxWidth: width }}
        >
          {TimeGutterHeader && <TimeGutterHeader />}
        </div>

        {resources.map(([id, resource], idx) => (
          <div className="rbc-time-header-content" key={id || idx}>
            {resource && (
              <TimeGridResourceHeader
                idx={idx}
                accessors={accessors}
                resource={resource}
              />
            )}
            <div
              className={`rbc-row rbc-time-header-cell${
                range.length <= 1 ? ' rbc-time-header-cell-single-day' : ''
              }`}
            >
              {this.renderHeaderCells(range)}
            </div>
            {/*<DateContentRow*/}
            {/*isAllDay={false}*/}
            {/*rtl={rtl}*/}
            {/*getNow={getNow}*/}
            {/*minRows={2}*/}
            {/*range={range}*/}
            {/*events={groupedEvents.get(id) || []}*/}
            {/*resourceId={resource && id}*/}
            {/*className="rbc-allday-cell"*/}
            {/*selectable={selectable}*/}
            {/*selected={this.props.selected}*/}
            {/*components={components}*/}
            {/*accessors={accessors}*/}
            {/*getters={getters}*/}
            {/*localizer={localizer}*/}
            {/*onSelect={this.props.onSelectEvent}*/}
            {/*onDoubleClick={this.props.onDoubleClickEvent}*/}
            {/*onSelectSlot={this.props.onSelectSlot}*/}
            {/*longPressThreshold={this.props.longPressThreshold}*/}
            {/*renderForMeasure={false}*/}
            {/*/>*/}
          </div>
        ))}
      </div>
    )
  }
}

export default TimeGridHeader
