# Protein-Based Antibiotic Resistance Classification

Antimicrobial resistance (AMR) poses a growing threat to global health, driven by the rapid evolution of resistance genes among bacteria. Bacteria are constantly evolving mechanisms that let them survive antibiotics, and those mechanisms are encoded in their protein sequences. If you know how to read them, you can see resistance coming before you ever run a lab test. This project builds a deep learning model that does exactly that.

We trained a ResNet-1D classifier on over 6,000 curated protein sequences from the Comprehensive Antibiotic Resistance Database (CARD v4.0.1) to predict which of 38 antibiotic resistance classes a given protein sequence confers. The model achieves a micro F1 of 0.93 and a macro ROC-AUC of 0.98 on a held-out test set of 912 sequences.

This was a team project for CSC413 (Neural Networks and Deep Learning) at the University of Toronto, completed December 2025.

## Why this is a hard problem

Traditional resistance profiling means growing bacteria on agar plates for 2 to 7 days, then testing against a panel of antibiotics. That works, but it is slow. A computational model that can read a protein sequence and predict resistance profiles supports faster clinical decisions without any lab work.

The challenge is that resistance is not simple. A single bacterial strain can carry multiple resistance genes simultaneously, and a single protein can contribute to resistance across more than one drug class at once. Standard single-label classification, where each sequence gets one answer, misses this entirely. The output of our model is a binary vector with one position per antibiotic class, and a 1 at position i means the sequence confers resistance to drug class i. The model makes all 38 decisions simultaneously for every input.

## The data

CARD v4.0.1 includes more than 6,000 protein sequences with experimentally validated antimicrobial resistance annotations. Each sequence is in FASTA format with ARO (Antibiotic Resistance Ontology) identifiers linking genes to their resistance profiles.

Sequence lengths vary from about 50 to over 2,000 amino acids. We tokenize using the standard 20 amino acids plus one token for ambiguous residues and one padding token, giving a vocabulary of 22. All sequences are padded or truncated to a maximum of 200 amino acids.

The class distribution is extremely uneven. Some resistance classes have thousands of examples; others have fewer than 100. This kind of imbalance is the norm in biological data.

## Three things that needed solving

### Sequence length variation

The model needs to handle inputs of variable length without breaking. Global adaptive max pooling takes care of this. After the convolutional encoder, it extracts the single strongest activation for each feature map across the entire sequence, no matter how long it is, and produces a fixed-size output. The classifier downstream never sees a sequence, only a vector.

### Class imbalance

With standard cross-entropy loss, the model could ignore rare resistance classes entirely and still post a good training loss, since rare classes barely move the aggregate. Focal Loss (alpha=1.0, gamma=2.0) addresses this by scaling the loss dynamically: easy examples the model already gets right contribute almost nothing, while hard or misclassified examples contribute much more. This pushes the model to actually learn the rare classes rather than coasting on the common ones.

After training, we ran per-class threshold optimization on the validation set, finding the decision cutoff that maximizes F1 for each of the 38 classes individually. A single global threshold of 0.5 would hurt performance on imbalanced classes.

### Sequence similarity leakage

Many protein sequences share high sequence identity across different organisms. If sequences from the same organism appeared in both training and test, the model could learn organism-specific signatures rather than genuine resistance mechanisms. The train/validation/test split (70/15/15) is done at the organism level, ensuring every sequence from a given source organism stays in exactly one split.

## The model

The architecture is a ResNet-1D (Residual Neural Network) adapted for one-dimensional protein sequences. Residual connections let the network go deeper without gradient degradation, which matters when local sequence motifs at different scales all carry information.

The four stages, totalling approximately 3.8 million parameters:

1. An embedding layer maps each amino acid token to a 256-dimensional dense vector, giving the network a learned representation of each amino acid rather than a raw integer.
2. Four sequential residual blocks run 1D convolutions over the sequence. Blocks 1 and 2 keep the channel dimension at 256. Block 3 doubles channels to 512 using a stride-2 convolution that also halves the sequence length. Block 4 stays at 512.
3. Global adaptive max pooling collapses the sequence dimension into a fixed (Batch, 512) tensor.
4. A two-layer MLP classifies: 512 to 256 with ReLU and Dropout(0.3), then 256 to 38 with sigmoid activations.

### Why ResNet and not a Transformer

Transformers have great long-range attention, but they need large amounts of training data. CARD sequences are short (50 to 2,000 amino acids), and many resistance classes have under 100 examples. CNNs are better suited here because they learn short discriminative motifs, around 3 to 15 amino acids, that correspond to structures like active sites and binding domains. These local patterns are exactly what drive antibiotic resistance mechanisms. CNNs are also more compute-efficient at this scale. Protein language models like ESM-2 and ProtBERT exist and are powerful, but they require significantly more data and resources than what CARD provides at this class granularity.

## Results

Evaluated on a held-out test set of 912 protein sequences across 38 resistance classes:

| Metric | Score |
|---|---|
| Micro F1 | 0.93 |
| Micro Precision | 0.94 |
| Micro Recall | 0.92 |
| Macro ROC-AUC | 0.98 |
| Macro F1 (all classes) | 0.31 |
| Macro F1 (classes with 20+ test samples) | 0.89 |

The micro F1 of 0.93 means the model gets the right answer on the vast majority of individual predictions. The macro ROC-AUC of 0.98 shows that the model learned genuine sequence-level features, not just class frequencies. The comparison with the majority-label baseline makes this concrete: a baseline that predicts each class based purely on training frequency, ignoring the actual sequence, achieves a micro F1 of 0.05. The ResNet-1D reaches 0.93, an improvement of over 1700%.

The lower overall Macro F1 of 0.31 reflects the rare classes, which do not have enough training examples to learn reliably. When restricted to classes with at least 20 test samples, Macro F1 rises to 0.89.

## Limitations

Rare classes remain the main limitation. Some resistance classes have so few examples that no model trained on CARD alone will generalize to them well. The gap between overall Macro F1 (0.31) and filtered Macro F1 (0.89) is almost entirely a data scarcity problem, not a model problem.

The ResNet architecture captures local sequence motifs but does not model long-range interactions as well as Transformer-based protein language models. For resistance mechanisms that depend on distant residue interactions across the full protein structure, this is a real ceiling.

CARD is also a curated and taxonomically focused database. Resistance genes from environmental sources or emerging clinical pathogens that have not yet been sequenced and annotated into CARD will not be represented.

## Credits

This project was built with three teammates as part of CSC413 at the University of Toronto.

**Mark Noge** (mark.noge@mail.utoronto.ca) | University of Toronto

**Amas Tam** (amas.tam@mail.utoronto.ca) | University of Toronto

**Kevin Thevara** (amas.tam@mail.utoronto.ca) | University of Toronto
