function WeeklyInsightCard({ insight }) {
  if (!insight) return null;
  
  return (
    <div className="mb-6 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
      <h2 className="text-lg font-semibold text-indigo-700 mb-2">
        🧠 Weekly AI Insight
      </h2>

      {/* Summary */}
      {insight.summary && (
        <p className="text-gray-700 mb-3">
          {insight.summary}
        </p>
      )}

      {/* Dominant moods */}
      {insight.dominantMoods?.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-600 mb-1">
            Dominant moods:
          </p>
          <div className="flex flex-wrap gap-2">
            {insight.dominantMoods.map((mood, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full"
              >
                {mood}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mental trend */}
      {insight.mentalTrend && (
        <p className="text-sm text-gray-600 mb-3">
          📈 <span className="font-medium">Trend:</span> {insight.mentalTrend}
        </p>
      )}

      {/* Recommendations */}
      {insight.recommendations?.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            🌱 Recommendations:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {insight.recommendations.map((rec, i) => (
              <li key={i}>
                <span className="font-medium">{rec.title}</span>
                {rec.description && (
                  <span className="text-gray-600">
                    {" — "}{rec.description}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WeeklyInsightCard;
