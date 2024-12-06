import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import Property from "./Property";
import Type from "./Type";
import LoadingPopup from "./LoadingPopup";

const PROPERTIES = [
  "Reflexivity",
  "Irreflexivity",
  "Symmetry",
  "Asymmetry",
  "Antisymmetry",
  "Transitivity",
  "Antitransitivity",
  "Totality",
  "Trichotomy",
];

type Props = {
  relation: number[][];
};

const Predictions: React.FC<Props> = ({ relation }) => {
  const [models, setModels] = useState<tf.LayersModel[] | null>(null);
  const [predictions, setPredictions] = useState<number[]>(Array(6).fill(0));

  useEffect(() => {
    const loadModels = async () => {
      setModels(
        await Promise.all(
          PROPERTIES.map(property =>
            tf.loadLayersModel(`/models/${property.toLowerCase()}/model.json`)
          )
        )
      );
    };

    loadModels();
  }, []);

  useEffect(() => {
    const makePrediction = async () => {
      if (!models) return;

      const input = tf.tensor(relation).reshape([1, 25]);
      const results = models.map(model => model.predict(input));

      const newPredictions = [];

      for (const result of results) {
        const prediction = await (result as any).array();
        newPredictions.push(prediction);
      }

      setPredictions(newPredictions);
    };

    makePrediction();
  }, [models, relation]);

  return (
    <>
      {!models && <LoadingPopup />}
      <div className="w-[332px]">
        <div className="flex flex-col gap-1">
          {predictions.map((prediction, index) => (
            <Property
              key={index}
              name={PROPERTIES[index]}
              prediction={prediction}
            />
          ))}
        </div>
        <div>
          <Type
            name="Equivalence"
            dependencies={[predictions[0], predictions[2], predictions[5]]}
          />
          <Type
            name="Partial Order"
            dependencies={[predictions[0], predictions[4], predictions[5]]}
          />
          <Type
            name="Total Order"
            dependencies={[
              predictions[0],
              predictions[4],
              predictions[5],
              predictions[7],
            ]}
          />
          <Type
            name="Strict Partial Order"
            dependencies={[predictions[1], predictions[5]]}
          />
          <Type
            name="Strict Total Order"
            dependencies={[predictions[1], predictions[5], predictions[7]]}
          />
        </div>
      </div>
    </>
  );
};

export default Predictions;
