# Position Sizing Calculator
#
# Written by: @JohnMuchow https://twitter.com/JohnMuchow
# Website: http://PlayTheTrade.com
#
# v1.1

def aggregationPeriod = GetAggregationPeriod();
def lastPrice = close(priceType = PriceType.LAST);

#------------------------------------------
# Moving averages
#------------------------------------------
def _21DayMovingAverage = MovingAverage(AverageType.Exponential, close, 21);
def _50DayMovingAverage = MovingAverage(AverageType.Simple, close, 50);
def _10WeekMovingAverage = MovingAverage(AverageType.Simple, close, 10);

#------------------------------------------
# User input parameters
#------------------------------------------
input amtToRisk = 1000;
input portfolioSize = 100000;
input additionalPercentBelowMA = 0;
input movingAverage = {default "21-day EMA", "50-day SMA"};

#------------------------------------------
# Percent below MA and risk of equity
#------------------------------------------
def absOfAdditionalPercentBelowMA = AbsValue(additionalPercentBelowMA);
def riskAsPercentOfEquity = amtToRisk / portfolioSize;

#------------------------------------------
# Distance to the target stop price
#------------------------------------------
def targetPrice21Day = _21DayMovingAverage * (1 - absOfAdditionalPercentBelowMA/100);
def targetPrice50Day = _50DayMovingAverage * (1 - absOfAdditionalPercentBelowMA/100);
def targetPrice10Week = _10WeekMovingAverage * (1 - absOfAdditionalPercentBelowMA/100);

#------------------------------------------
# For the 21-day
#------------------------------------------
def costOfShares21Day = amtToRisk / (1 - (targetPrice21Day / lastPrice));
def numberOfShares21Day = costOfShares21Day / lastPrice;
def positionSize21Day = costOfShares21Day / portfolioSize;
def pricePercentFromStop21Day = (targetPrice21Day / lastPrice) - 1;

#------------------------------------------
# For the 50-day
#------------------------------------------
def costOfShares50Day = amtToRisk / (1 - (targetPrice50Day / lastPrice));
def numberOfShares50Day = costOfShares50Day / lastPrice;
def positionSize50Day = costOfShares50Day / portfolioSize;
def pricePercentFromStop50Day = (targetPrice50Day / lastPrice) - 1;

#------------------------------------------
# For the 10-week
#------------------------------------------
def costOfShares10Week = amtToRisk / (1 - (targetPrice10Week / lastPrice));
def numberOfShares10Week = costOfShares10Week / lastPrice;
def positionSize10Week = costOfShares10Week / portfolioSize;
def pricePercentFromStop10Week = (targetPrice10Week / lastPrice) - 1;

#------------------------------------------
# Output
#------------------------------------------
def daily = if (aggregationPeriod >= aggregationPeriod.DAY and aggregationPeriod < aggregationPeriod.WEEK, 1, 0);

AddLabel((movingAverage == movingAverage."21-day EMA" AND daily AND lastPrice > (_21DayMovingAverage * 1.02)), "Amt to risk: " + AsDollars(Round(amtToRisk, 0)) +  " ", if daily then CreateColor(234, 136, 52) else CreateColor(90, 122, 176));

AddLabel((movingAverage == movingAverage."50-day SMA" AND daily AND lastPrice > (_50DayMovingAverage * 1.02)), "Amt to risk: " + AsDollars(Round(amtToRisk, 0)) +  " ", if daily then CreateColor(234, 136, 52) else CreateColor(90, 122, 176));

AddLabel(!daily AND lastPrice > (_10WeekMovingAverage * 1.02), "Amt to risk: " + AsDollars(Round(amtToRisk, 0)) +  " ", if daily then CreateColor(234, 136, 52) else CreateColor(90, 122, 176));

AddLabel((movingAverage == movingAverage."21-day EMA" AND daily AND lastPrice > (_21DayMovingAverage * 1.02)), (if absOfAdditionalPercentBelowMA then absOfAdditionalPercentBelowMA+"% below" else "") + " 21-day as stop: "  + Round(costOfShares21Day / lastPrice, 0) + " shares (" + AsDollars(costOfShares21Day) + ") | Position size: " + AsPercent(positionSize21Day) + " | Risk as % of equity: " + AsPercent(riskAsPercentOfEquity) + " | % from stop: " + AsPercent(pricePercentFromStop21Day) + " | Stop: " + Round(targetPrice21Day, 2), Color.GRAY);

AddLabel((movingAverage == movingAverage."50-day SMA" AND daily AND lastPrice > (_50DayMovingAverage * 1.02)), (if absOfAdditionalPercentBelowMA then absOfAdditionalPercentBelowMA+"% below" else "") + " 50-day as stop: "  + Round(costOfShares50Day / lastPrice, 0) + " shares (" + AsDollars(costOfShares50Day) + ") | Position size: " + AsPercent(positionSize50Day) + " | Risk as % of equity: " + AsPercent(riskAsPercentOfEquity) + " | % from stop: " + AsPercent(pricePercentFromStop50Day) + " | Stop: " + Round(targetPrice50Day, 2), Color.GRAY);

AddLabel(!daily AND lastPrice > (_10WeekMovingAverage * 1.02), (if absOfAdditionalPercentBelowMA then absOfAdditionalPercentBelowMA+"% below" else "") + " 10-week as stop: "  + Round(costOfShares10Week / lastPrice, 0) + " shares (" + AsDollars(costOfShares10Week) + ") | Position size: " + AsPercent(positionSize10Week) + " | Risk as % of equity: " + AsPercent(riskAsPercentOfEquity) + " | % from stop: " + AsPercent(pricePercentFromStop10Week) + " | Stop: " + Round(targetPrice10week, 2), Color.GRAY);
