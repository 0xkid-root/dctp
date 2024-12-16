import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

const PerformanceChart = ({ chartData }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const areaSeriesRef = useRef(null);

  const backgroundColor = 'white';
  const textColor = 'black';

  console.log('~~~~~~~~~~~~~~', chartData);


  useEffect(() => {
    // Initialize the chart
    try{

      chartRef.current = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: backgroundColor },
          textColor,
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
      });
      
      
      // Add area series to the chart
      areaSeriesRef.current = chartRef.current.addAreaSeries({
        lineColor: '#2196F3',
        topColor: 'rgba(33, 150, 243, 0.3)',
        bottomColor: 'rgba(33, 150, 243, 0.1)',
      });
      
      // Set initial data
      areaSeriesRef.current.setData(chartData);
      chartRef.current.timeScale().fitContent();
      
    } catch (error) {
      console.error('Error during charting', error);
    } finally {

      // Clean up on component unmount
      return () => chartRef.current.remove();
    }
      
  }, []);

  useEffect(() => {
    try{

      // Update chart with new data when it changes
      if (areaSeriesRef.current) {
        areaSeriesRef.current.setData(chartData);
      }
    } catch (error) {
      console.error('Error during seriesData update', error);
    }
  }, [chartData]);

  // Resize chart on window resize
  useEffect(() => {
    const handleResize = () => {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  
  }, []);

  return <div ref={chartContainerRef} style={{ position: 'relative', width: '100%' }} />;
};

export default PerformanceChart;
