import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  // {
  //   title: "R&D",
  //   Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
  //   description: (
  //     <>
  //       The ETEN Innovation Lab is conducting R&D in the field of Bible
  //       Translation
  //     </>
  //   ),
  // },
  // {
  //   title: "Innovative Solutions",
  //   Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
  //   description: (
  //     <>
  //       ETEN Innovation labs is coming up with innovation solutions to
  //       challenging problems faced by Bible translation organizations.
  //     </>
  //   ),
  // },
  // {
  //   title: "Latest Tech Stack",
  //   Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
  //   description: (
  //     <>
  //       ETEN Innovation labs is using the latest tech stack to build the next
  //       generation of Bible Translation tools.
  //     </>
  //   ),
  // },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
