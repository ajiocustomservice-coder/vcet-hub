import { r as reactExports, R as React, a as reactDomExports } from "./index-wHOPJHDJ.js";
import { a as leafletSrcExports } from "./leaflet-src-CJ26yHQi.js";
function useAttribution(map, attribution) {
  const attributionRef = reactExports.useRef(attribution);
  reactExports.useEffect(function updateAttribution() {
    if (attribution !== attributionRef.current && map.attributionControl != null) {
      if (attributionRef.current != null) {
        map.attributionControl.removeAttribution(attributionRef.current);
      }
      if (attribution != null) {
        map.attributionControl.addAttribution(attribution);
      }
    }
    attributionRef.current = attribution;
  }, [
    map,
    attribution
  ]);
}
function updateCircle(layer, props, prevProps) {
  if (props.center !== prevProps.center) {
    layer.setLatLng(props.center);
  }
  if (props.radius != null && props.radius !== prevProps.radius) {
    layer.setRadius(props.radius);
  }
}
const CONTEXT_VERSION = 1;
function createLeafletContext(map) {
  return Object.freeze({
    __version: CONTEXT_VERSION,
    map
  });
}
function extendContext(source, extra) {
  return Object.freeze({
    ...source,
    ...extra
  });
}
const LeafletContext = reactExports.createContext(null);
function useLeafletContext() {
  const context = reactExports.use(LeafletContext);
  if (context == null) {
    throw new Error("No context provided: useLeafletContext() can only be used in a descendant of <MapContainer>");
  }
  return context;
}
function createContainerComponent(useElement) {
  function ContainerComponent(props, forwardedRef) {
    const { instance, context } = useElement(props).current;
    reactExports.useImperativeHandle(forwardedRef, () => instance);
    const { children } = props;
    return children == null ? null : /* @__PURE__ */ React.createElement(LeafletContext, {
      value: context
    }, children);
  }
  return /* @__PURE__ */ reactExports.forwardRef(ContainerComponent);
}
function createDivOverlayComponent(useElement) {
  function OverlayComponent(props, forwardedRef) {
    const [isOpen, setOpen] = reactExports.useState(false);
    const { instance } = useElement(props, setOpen).current;
    reactExports.useImperativeHandle(forwardedRef, () => instance);
    reactExports.useEffect(function updateOverlay() {
      if (isOpen) {
        instance.update();
      }
    }, [
      instance,
      isOpen,
      props.children
    ]);
    const contentNode = instance._contentNode;
    return contentNode ? /* @__PURE__ */ reactDomExports.createPortal(props.children, contentNode) : null;
  }
  return /* @__PURE__ */ reactExports.forwardRef(OverlayComponent);
}
function createLeafComponent(useElement) {
  function LeafComponent(props, forwardedRef) {
    const { instance } = useElement(props).current;
    reactExports.useImperativeHandle(forwardedRef, () => instance);
    return null;
  }
  return /* @__PURE__ */ reactExports.forwardRef(LeafComponent);
}
function createControlHook(useElement) {
  return function useLeafletControl(props) {
    const context = useLeafletContext();
    const elementRef = useElement(props, context);
    const { instance } = elementRef.current;
    const positionRef = reactExports.useRef(props.position);
    const { position } = props;
    reactExports.useEffect(function addControl() {
      instance.addTo(context.map);
      return function removeControl() {
        instance.remove();
      };
    }, [
      context.map,
      instance
    ]);
    reactExports.useEffect(function updateControl() {
      if (position != null && position !== positionRef.current) {
        instance.setPosition(position);
        positionRef.current = position;
      }
    }, [
      instance,
      position
    ]);
    return elementRef;
  };
}
function useEventHandlers(element, eventHandlers) {
  const eventHandlersRef = reactExports.useRef(void 0);
  reactExports.useEffect(function addEventHandlers() {
    if (eventHandlers != null) {
      element.instance.on(eventHandlers);
    }
    eventHandlersRef.current = eventHandlers;
    return function removeEventHandlers() {
      if (eventHandlersRef.current != null) {
        element.instance.off(eventHandlersRef.current);
      }
      eventHandlersRef.current = null;
    };
  }, [
    element,
    eventHandlers
  ]);
}
function withPane(props, context) {
  const pane = props.pane ?? context.pane;
  return pane ? {
    ...props,
    pane
  } : props;
}
function createDivOverlayHook(useElement, useLifecycle) {
  return function useDivOverlay(props, setOpen) {
    const context = useLeafletContext();
    const elementRef = useElement(withPane(props, context), context);
    useAttribution(context.map, props.attribution);
    useEventHandlers(elementRef.current, props.eventHandlers);
    useLifecycle(elementRef.current, context, props, setOpen);
    return elementRef;
  };
}
function splitClassName(className) {
  return className.split(" ").filter(Boolean);
}
function addClassName(element, className) {
  for (const cls of splitClassName(className)) {
    leafletSrcExports.DomUtil.addClass(element, cls);
  }
}
function createElementObject(instance, context, container) {
  return Object.freeze({
    instance,
    context,
    container
  });
}
function createElementHook(createElement, updateElement) {
  if (updateElement == null) {
    return function useImmutableLeafletElement(props, context) {
      const elementRef = reactExports.useRef(void 0);
      if (!elementRef.current) elementRef.current = createElement(props, context);
      return elementRef;
    };
  }
  return function useMutableLeafletElement(props, context) {
    const elementRef = reactExports.useRef(void 0);
    if (!elementRef.current) elementRef.current = createElement(props, context);
    const propsRef = reactExports.useRef(props);
    const { instance } = elementRef.current;
    reactExports.useEffect(function updateElementProps() {
      if (propsRef.current !== props) {
        updateElement(instance, props, propsRef.current);
        propsRef.current = props;
      }
    }, [
      instance,
      props,
      updateElement
    ]);
    return elementRef;
  };
}
function useLayerLifecycle(element, context) {
  reactExports.useEffect(function addLayer() {
    const container = context.layerContainer ?? context.map;
    container.addLayer(element.instance);
    return function removeLayer() {
      var _a;
      (_a = context.layerContainer) == null ? void 0 : _a.removeLayer(element.instance);
      context.map.removeLayer(element.instance);
    };
  }, [
    context,
    element
  ]);
}
function createLayerHook(useElement) {
  return function useLayer(props) {
    const context = useLeafletContext();
    const elementRef = useElement(withPane(props, context), context);
    useAttribution(context.map, props.attribution);
    useEventHandlers(elementRef.current, props.eventHandlers);
    useLayerLifecycle(elementRef.current, context);
    return elementRef;
  };
}
function usePathOptions(element, props) {
  const optionsRef = reactExports.useRef(void 0);
  reactExports.useEffect(function updatePathOptions() {
    if (props.pathOptions !== optionsRef.current) {
      const options = props.pathOptions ?? {};
      element.instance.setStyle(options);
      optionsRef.current = options;
    }
  }, [
    element,
    props
  ]);
}
function createPathHook(useElement) {
  return function usePath(props) {
    const context = useLeafletContext();
    const elementRef = useElement(withPane(props, context), context);
    useEventHandlers(elementRef.current, props.eventHandlers);
    useLayerLifecycle(elementRef.current, context);
    usePathOptions(elementRef.current, props);
    return elementRef;
  };
}
function createControlComponent(createInstance) {
  function createElement(props, context) {
    return createElementObject(createInstance(props), context);
  }
  const useElement = createElementHook(createElement);
  const useControl = createControlHook(useElement);
  return createLeafComponent(useControl);
}
function createLayerComponent(createElement, updateElement) {
  const useElement = createElementHook(createElement, updateElement);
  const useLayer = createLayerHook(useElement);
  return createContainerComponent(useLayer);
}
function createOverlayComponent(createElement, useLifecycle) {
  const useElement = createElementHook(createElement);
  const useOverlay = createDivOverlayHook(useElement, useLifecycle);
  return createDivOverlayComponent(useOverlay);
}
function createPathComponent(createElement, updateElement) {
  const useElement = createElementHook(createElement, updateElement);
  const usePath = createPathHook(useElement);
  return createContainerComponent(usePath);
}
function createTileLayerComponent(createElement, updateElement) {
  const useElement = createElementHook(createElement, updateElement);
  const useLayer = createLayerHook(useElement);
  return createLeafComponent(useLayer);
}
function updateGridLayer(layer, props, prevProps) {
  const { opacity, zIndex } = props;
  if (opacity != null && opacity !== prevProps.opacity) {
    layer.setOpacity(opacity);
  }
  if (zIndex != null && zIndex !== prevProps.zIndex) {
    layer.setZIndex(zIndex);
  }
}
function updateMediaOverlay(overlay, props, prevProps) {
  if (props.bounds instanceof leafletSrcExports.LatLngBounds && props.bounds !== prevProps.bounds) {
    overlay.setBounds(props.bounds);
  }
  if (props.opacity != null && props.opacity !== prevProps.opacity) {
    overlay.setOpacity(props.opacity);
  }
  if (props.zIndex != null && props.zIndex !== prevProps.zIndex) {
    overlay.setZIndex(props.zIndex);
  }
}
function useMap() {
  return useLeafletContext().map;
}
function useMapEvent(type, handler) {
  const map = useMap();
  reactExports.useEffect(function addMapEventHandler() {
    map.on(type, handler);
    return function removeMapEventHandler() {
      map.off(type, handler);
    };
  }, [
    map,
    type,
    handler
  ]);
  return map;
}
function useMapEvents(handlers) {
  const map = useMap();
  reactExports.useEffect(function addMapEventHandlers() {
    map.on(handlers);
    return function removeMapEventHandlers() {
      map.off(handlers);
    };
  }, [
    map,
    handlers
  ]);
  return map;
}
const AttributionControl = createControlComponent(function createAttributionControl(props) {
  return new leafletSrcExports.Control.Attribution(props);
});
const Circle = createPathComponent(function createCircle({ center, children: _c, ...options }, ctx) {
  const circle = new leafletSrcExports.Circle(center, options);
  return createElementObject(circle, extendContext(ctx, {
    overlayContainer: circle
  }));
}, updateCircle);
const CircleMarker = createPathComponent(function createCircleMarker({ center, children: _c, ...options }, ctx) {
  const marker = new leafletSrcExports.CircleMarker(center, options);
  return createElementObject(marker, extendContext(ctx, {
    overlayContainer: marker
  }));
}, updateCircle);
const FeatureGroup = createPathComponent(function createFeatureGroup({ children: _c, ...options }, ctx) {
  const group = new leafletSrcExports.FeatureGroup([], options);
  return createElementObject(group, extendContext(ctx, {
    layerContainer: group,
    overlayContainer: group
  }));
});
const GeoJSON = createPathComponent(function createGeoJSON({ data, ...options }, ctx) {
  const geoJSON = new leafletSrcExports.GeoJSON(data, options);
  return createElementObject(geoJSON, extendContext(ctx, {
    overlayContainer: geoJSON
  }));
}, function updateGeoJSON(layer, props, prevProps) {
  if (props.style !== prevProps.style) {
    if (props.style == null) {
      layer.resetStyle();
    } else {
      layer.setStyle(props.style);
    }
  }
});
const ImageOverlay = createLayerComponent(function createImageOverlay({ bounds, url, ...options }, ctx) {
  const overlay = new leafletSrcExports.ImageOverlay(url, bounds, options);
  return createElementObject(overlay, extendContext(ctx, {
    overlayContainer: overlay
  }));
}, function updateImageOverlay(overlay, props, prevProps) {
  updateMediaOverlay(overlay, props, prevProps);
  if (props.bounds !== prevProps.bounds) {
    const bounds = props.bounds instanceof leafletSrcExports.LatLngBounds ? props.bounds : new leafletSrcExports.LatLngBounds(props.bounds);
    overlay.setBounds(bounds);
  }
  if (props.url !== prevProps.url) {
    overlay.setUrl(props.url);
  }
});
const LayerGroup = createLayerComponent(function createLayerGroup({ children: _c, ...options }, ctx) {
  const group = new leafletSrcExports.LayerGroup([], options);
  return createElementObject(group, extendContext(ctx, {
    layerContainer: group
  }));
});
const useLayersControlElement = createElementHook(function createLayersControl({ children: _c, ...options }, ctx) {
  const control = new leafletSrcExports.Control.Layers(void 0, void 0, options);
  return createElementObject(control, extendContext(ctx, {
    layersControl: control
  }));
}, function updateLayersControl(control, props, prevProps) {
  if (props.collapsed !== prevProps.collapsed) {
    if (props.collapsed === true) {
      control.collapse();
    } else {
      control.expand();
    }
  }
});
const useLayersControl = createControlHook(useLayersControlElement);
const LayersControl = createContainerComponent(useLayersControl);
function createControlledLayer(addLayerToControl) {
  return function ControlledLayer(props) {
    const parentContext = useLeafletContext();
    const propsRef = reactExports.useRef(props);
    const [layer, setLayer] = reactExports.useState(null);
    const { layersControl, map } = parentContext;
    const addLayer = reactExports.useCallback((layerToAdd) => {
      if (layersControl != null) {
        if (propsRef.current.checked) {
          map.addLayer(layerToAdd);
        }
        addLayerToControl(layersControl, layerToAdd, propsRef.current.name);
        setLayer(layerToAdd);
      }
    }, [
      addLayerToControl,
      layersControl,
      map
    ]);
    const removeLayer = reactExports.useCallback((layerToRemove) => {
      layersControl == null ? void 0 : layersControl.removeLayer(layerToRemove);
      setLayer(null);
    }, [
      layersControl
    ]);
    const context = reactExports.useMemo(() => {
      return extendContext(parentContext, {
        layerContainer: {
          addLayer,
          removeLayer
        }
      });
    }, [
      parentContext,
      addLayer,
      removeLayer
    ]);
    reactExports.useEffect(() => {
      if (layer !== null && propsRef.current !== props) {
        if (props.checked === true && (propsRef.current.checked == null || propsRef.current.checked === false)) {
          map.addLayer(layer);
        } else if (propsRef.current.checked === true && (props.checked == null || props.checked === false)) {
          map.removeLayer(layer);
        }
        propsRef.current = props;
      }
    });
    return props.children ? /* @__PURE__ */ React.createElement(LeafletContext, {
      value: context
    }, props.children) : null;
  };
}
LayersControl.BaseLayer = createControlledLayer(function addBaseLayer(layersControl, layer, name) {
  layersControl.addBaseLayer(layer, name);
});
LayersControl.Overlay = createControlledLayer(function addOverlay(layersControl, layer, name) {
  layersControl.addOverlay(layer, name);
});
function MapContainerComponent({ bounds, boundsOptions, center, children, className, id, placeholder, style, whenReady, zoom, ...options }, forwardedRef) {
  const [props] = reactExports.useState({
    className,
    id,
    style
  });
  const [context, setContext] = reactExports.useState(null);
  const mapInstanceRef = reactExports.useRef(void 0);
  reactExports.useImperativeHandle(forwardedRef, () => (context == null ? void 0 : context.map) ?? null, [
    context
  ]);
  const mapRef = reactExports.useCallback((node) => {
    if (node !== null && !mapInstanceRef.current) {
      const map = new leafletSrcExports.Map(node, options);
      mapInstanceRef.current = map;
      if (center != null && zoom != null) {
        map.setView(center, zoom);
      } else if (bounds != null) {
        map.fitBounds(bounds, boundsOptions);
      }
      if (whenReady != null) {
        map.whenReady(whenReady);
      }
      setContext(createLeafletContext(map));
    }
  }, []);
  reactExports.useEffect(() => {
    return () => {
      context == null ? void 0 : context.map.remove();
    };
  }, [
    context
  ]);
  const contents = context ? /* @__PURE__ */ React.createElement(LeafletContext, {
    value: context
  }, children) : placeholder ?? null;
  return /* @__PURE__ */ React.createElement("div", {
    ...props,
    ref: mapRef
  }, contents);
}
const MapContainer = /* @__PURE__ */ reactExports.forwardRef(MapContainerComponent);
const Marker = createLayerComponent(function createMarker({ position, ...options }, ctx) {
  const marker = new leafletSrcExports.Marker(position, options);
  return createElementObject(marker, extendContext(ctx, {
    overlayContainer: marker
  }));
}, function updateMarker(marker, props, prevProps) {
  if (props.position !== prevProps.position) {
    marker.setLatLng(props.position);
  }
  if (props.icon != null && props.icon !== prevProps.icon) {
    marker.setIcon(props.icon);
  }
  if (props.zIndexOffset != null && props.zIndexOffset !== prevProps.zIndexOffset) {
    marker.setZIndexOffset(props.zIndexOffset);
  }
  if (props.opacity != null && props.opacity !== prevProps.opacity) {
    marker.setOpacity(props.opacity);
  }
  if (marker.dragging != null && props.draggable !== prevProps.draggable) {
    if (props.draggable === true) {
      marker.dragging.enable();
    } else {
      marker.dragging.disable();
    }
  }
});
const DEFAULT_PANES = [
  "mapPane",
  "markerPane",
  "overlayPane",
  "popupPane",
  "shadowPane",
  "tilePane",
  "tooltipPane"
];
function omitPane(obj, pane) {
  const { [pane]: _p, ...others } = obj;
  return others;
}
function createPane(name, props, context) {
  if (DEFAULT_PANES.indexOf(name) !== -1) {
    throw new Error(`You must use a unique name for a pane that is not a default Leaflet pane: ${name}`);
  }
  if (context.map.getPane(name) != null) {
    throw new Error(`A pane with this name already exists: ${name}`);
  }
  const parentPaneName = props.pane ?? context.pane;
  const parentPane = parentPaneName ? context.map.getPane(parentPaneName) : void 0;
  const element = context.map.createPane(name, parentPane);
  if (props.className != null) {
    addClassName(element, props.className);
  }
  if (props.style != null) {
    for (const key of Object.keys(props.style)) {
      element.style[key] = props.style[key];
    }
  }
  return element;
}
function PaneComponent(props, forwardedRef) {
  const [paneName] = reactExports.useState(props.name);
  const [paneElement, setPaneElement] = reactExports.useState(null);
  reactExports.useImperativeHandle(forwardedRef, () => paneElement, [
    paneElement
  ]);
  const context = useLeafletContext();
  const newContext = reactExports.useMemo(() => ({
    ...context,
    pane: paneName
  }), [
    context
  ]);
  reactExports.useEffect(() => {
    setPaneElement(createPane(paneName, props, context));
    return function removeCreatedPane() {
      var _a;
      const pane = context.map.getPane(paneName);
      (_a = pane == null ? void 0 : pane.remove) == null ? void 0 : _a.call(pane);
      if (context.map._panes != null) {
        context.map._panes = omitPane(context.map._panes, paneName);
        context.map._paneRenderers = omitPane(
          // @ts-ignore map internals
          context.map._paneRenderers,
          paneName
        );
      }
    };
  }, []);
  return props.children != null && paneElement != null ? /* @__PURE__ */ reactDomExports.createPortal(/* @__PURE__ */ React.createElement(LeafletContext, {
    value: newContext
  }, props.children), paneElement) : null;
}
const Pane = /* @__PURE__ */ reactExports.forwardRef(PaneComponent);
const Polygon = createPathComponent(function createPolygon({ positions, ...options }, ctx) {
  const polygon = new leafletSrcExports.Polygon(positions, options);
  return createElementObject(polygon, extendContext(ctx, {
    overlayContainer: polygon
  }));
}, function updatePolygon(layer, props, prevProps) {
  if (props.positions !== prevProps.positions) {
    layer.setLatLngs(props.positions);
  }
});
const Polyline = createPathComponent(function createPolyline({ positions, ...options }, ctx) {
  const polyline = new leafletSrcExports.Polyline(positions, options);
  return createElementObject(polyline, extendContext(ctx, {
    overlayContainer: polyline
  }));
}, function updatePolyline(layer, props, prevProps) {
  if (props.positions !== prevProps.positions) {
    layer.setLatLngs(props.positions);
  }
});
const Popup = createOverlayComponent(function createPopup(props, context) {
  const popup = new leafletSrcExports.Popup(props, context.overlayContainer);
  return createElementObject(popup, context);
}, function usePopupLifecycle(element, context, { position }, setOpen) {
  reactExports.useEffect(function addPopup() {
    const { instance } = element;
    function onPopupOpen(event) {
      if (event.popup === instance) {
        instance.update();
        setOpen(true);
      }
    }
    function onPopupClose(event) {
      if (event.popup === instance) {
        setOpen(false);
      }
    }
    context.map.on({
      popupopen: onPopupOpen,
      popupclose: onPopupClose
    });
    if (context.overlayContainer == null) {
      if (position != null) {
        instance.setLatLng(position);
      }
      instance.openOn(context.map);
    } else {
      context.overlayContainer.bindPopup(instance);
    }
    return function removePopup() {
      var _a;
      context.map.off({
        popupopen: onPopupOpen,
        popupclose: onPopupClose
      });
      (_a = context.overlayContainer) == null ? void 0 : _a.unbindPopup();
      context.map.removeLayer(instance);
    };
  }, [
    element,
    context,
    setOpen,
    position
  ]);
});
const Rectangle = createPathComponent(function createRectangle({ bounds, ...options }, ctx) {
  const rectangle = new leafletSrcExports.Rectangle(bounds, options);
  return createElementObject(rectangle, extendContext(ctx, {
    overlayContainer: rectangle
  }));
}, function updateRectangle(layer, props, prevProps) {
  if (props.bounds !== prevProps.bounds) {
    layer.setBounds(props.bounds);
  }
});
const ScaleControl = createControlComponent(function createScaleControl(props) {
  return new leafletSrcExports.Control.Scale(props);
});
const useSVGOverlayElement = createElementHook(function createSVGOverlay(props, context) {
  const { attributes, bounds, ...options } = props;
  const container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  container.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  if (attributes != null) {
    for (const name of Object.keys(attributes)) {
      container.setAttribute(name, attributes[name]);
    }
  }
  const overlay = new leafletSrcExports.SVGOverlay(container, bounds, options);
  return createElementObject(overlay, context, container);
}, updateMediaOverlay);
const useSVGOverlay = createLayerHook(useSVGOverlayElement);
function SVGOverlayComponent({ children, ...options }, forwardedRef) {
  const { instance, container } = useSVGOverlay(options).current;
  reactExports.useImperativeHandle(forwardedRef, () => instance);
  return container == null || children == null ? null : /* @__PURE__ */ reactDomExports.createPortal(children, container);
}
const SVGOverlay = /* @__PURE__ */ reactExports.forwardRef(SVGOverlayComponent);
const TileLayer = createTileLayerComponent(function createTileLayer({ url, ...options }, context) {
  const layer = new leafletSrcExports.TileLayer(url, withPane(options, context));
  return createElementObject(layer, context);
}, function updateTileLayer(layer, props, prevProps) {
  updateGridLayer(layer, props, prevProps);
  const { url } = props;
  if (url != null && url !== prevProps.url) {
    layer.setUrl(url);
  }
});
const Tooltip = createOverlayComponent(function createTooltip(props, context) {
  const tooltip = new leafletSrcExports.Tooltip(props, context.overlayContainer);
  return createElementObject(tooltip, context);
}, function useTooltipLifecycle(element, context, { position }, setOpen) {
  reactExports.useEffect(function addTooltip() {
    const container = context.overlayContainer;
    if (container == null) {
      return;
    }
    const { instance } = element;
    const onTooltipOpen = (event) => {
      if (event.tooltip === instance) {
        if (position != null) {
          instance.setLatLng(position);
        }
        instance.update();
        setOpen(true);
      }
    };
    const onTooltipClose = (event) => {
      if (event.tooltip === instance) {
        setOpen(false);
      }
    };
    container.on({
      tooltipopen: onTooltipOpen,
      tooltipclose: onTooltipClose
    });
    container.bindTooltip(instance);
    return function removeTooltip() {
      container.off({
        tooltipopen: onTooltipOpen,
        tooltipclose: onTooltipClose
      });
      if (container._map != null) {
        container.unbindTooltip();
      }
    };
  }, [
    element,
    context,
    setOpen,
    position
  ]);
});
const VideoOverlay = createLayerComponent(function createVideoOverlay({ bounds, url, ...options }, ctx) {
  var _a;
  const overlay = new leafletSrcExports.VideoOverlay(url, bounds, options);
  if (options.play === true) {
    (_a = overlay.getElement()) == null ? void 0 : _a.play();
  }
  return createElementObject(overlay, extendContext(ctx, {
    overlayContainer: overlay
  }));
}, function updateVideoOverlay(overlay, props, prevProps) {
  updateMediaOverlay(overlay, props, prevProps);
  if (typeof props.url === "string" && props.url !== prevProps.url) {
    overlay.setUrl(props.url);
  }
  const video = overlay.getElement();
  if (video != null) {
    if (props.play === true && !prevProps.play) {
      video.play();
    } else if (!props.play && prevProps.play === true) {
      video.pause();
    }
  }
});
const WMSTileLayer = createTileLayerComponent(function createWMSTileLayer({ eventHandlers: _eh, params = {}, url, ...options }, context) {
  const layer = new leafletSrcExports.TileLayer.WMS(url, {
    ...params,
    ...withPane(options, context)
  });
  return createElementObject(layer, context);
}, function updateWMSTileLayer(layer, props, prevProps) {
  updateGridLayer(layer, props, prevProps);
  if (props.params != null && props.params !== prevProps.params) {
    layer.setParams(props.params);
  }
});
const ZoomControl = createControlComponent(function createZoomControl(props) {
  return new leafletSrcExports.Control.Zoom(props);
});
export {
  AttributionControl,
  Circle,
  CircleMarker,
  FeatureGroup,
  GeoJSON,
  ImageOverlay,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Pane,
  Polygon,
  Polyline,
  Popup,
  Rectangle,
  SVGOverlay,
  ScaleControl,
  TileLayer,
  Tooltip,
  VideoOverlay,
  WMSTileLayer,
  ZoomControl,
  useMap,
  useMapEvent,
  useMapEvents
};
