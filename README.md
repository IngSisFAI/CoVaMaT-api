# CoVaMaT : Context Variety Management Tool

**CoVaMaT** is a tool developed to assist in the variety identification process (top-down and/or bottom-up), as shown in the next figure.

![image](https://github.com/user-attachments/assets/d917618e-8b86-471f-952c-ddcf7001ee47)

 A variety identification process determines how  a Big Data System can be developed, and  is implemented using these tow approaches:

+ *Top-down (T-VIP) approach*: In this approach, left hand side of the figure,  (1) given a domain problem, an expert user elaborates one or more hypotheses that should be tested through data analysis (i.e. Are data supporting this?); (2) then, the hypotheses are taken by data analysts who proceed to carry out  the activities included in a Big Data Process (3); finally, results are returned to verify the hypotheses (4) possibly visualizing data in different ways, and allowing hypothesis reformulation or process ending, alternatively (5). 

+ *Bottom-up (B-VIP) approach*: In this approach, right hand side of the figure, (1) given a domain problem, an expert user decides to launch an exploratory study to find out what data can reveal for this problem (i.e. What do data say?); (2) then, the study is carried out by data analysts (2), again by applying the activities included in a Big Data Process (3); and finally, results (findings) are returned to be validated with experts (4), alternately ending the process or reformulating the search (5).

In the middle of the figure, we can see the activities of the Big Data Process including *collection* of source data, *preparation* and *transformation* of these source data, *analytics* of data for analyzing prepared data and determining the processing type (batch, real-time, etc.), *visualization* of the resulting analysis, and *access* of data consumers to these results. 
Following, the left side of the figure shows how the variety can influence design decisions. We define four varieties: (1) *source variety* during *collection*,  helps to detect different data structures, acquisition techniques, etc., (2) *content variety* is focused on the way data should be transformed according to relevant variables for the business goals to be achieved, mostly considering source variations during *preparation*, (3) *process variety*  helps detect variations in data analysis techniques and it is particularly involved in *analytics* and visualization, and (4) *context variety* allows developers to identify domain variations that may constrain or affect the results of the analysis during the whole Big Data system development. 


Finally, highlighted components in the figure are the *knowlegde-based assets* (in green in the figure). These components represent the repositories that software/AI engineers/developers can use to develop BD systems, reducing the need to re-create components that provide similar functionalities.  Here, we can see CoVaMaT, that  acts as a *domain asset repository*, which is focused on allowing the definition of domain assets (for variety and case definitions), and reuse previous experiences of use in the same or similar domains/sub-domains. 

## Use of CoVaMaT

CoVaMat includes three main functionalities (F1, F2 and F3) supported by three services, three business processes, and three events. They are functionalities for variety documentation, case instantiation and  case reuse. The next figure shows the functionalities of CoVaMaT.

![image](https://github.com/user-attachments/assets/5e1131f0-a9c2-40e7-86f5-2b643bbbe99e)

* **Functionality for variety documentation: S-1, P-1 and E-1**: This functionality allows to specify domain variety of a case as hierarchies of variety types, which may be identified through domain analysis (usually T-VIP) or exploratory studies (usually B-VIP). For instance, the different possibilities for water bodies, water quality parameters, etc., are candidates for specifying domain variations of hydrology systems. Thus, variety types are detected when developing domain cases and attended by a service (S-1), which is supported by a process (P-1: *Documenting domain variety*) when a searching requirement occurs (event E-1: *Start looking for varieties*).

* **Functionality for case instantiation: S-2, P-2 and E-2**: This functionality allows to instantiate a domain case through variety selection. For instance, we may select the case of *river* for instantiating water body variety; *dissolved oxygen* for quality parameters, and so on.  Notice that possible variety instances were previously created by P-1. Thus, domain case instantiations are created and stored as domain assets by a service (S-2), which is supported by a process (P-2: *Defining domain case*) when an invocation to CoVaMaT occurs (event E-1: *Require the use of case instantiation*).

* **Functionality for case reuse: S-3, P-3, P-4 and E-3**: This functionality allows to reuse domain variety assets (created in P-1) and/or domain case assets (created in P-2). For instance, we may reuse the case of *river* for another river in a different location; *dissolved oxygen* and *pH* as relevant quality parameters; and so on. Notice that reusing does not imply exact matching of domain assets. Thus, stakeholders may query domain assets previously stored, and compare them to a particular context aiming at detecting similar cases. Therefore, queries are based on the context defined by the stakeholders, retrieving any related domain asset (domain variety and/or domain case assets).   
The reusable cases are stored as *reusable case assets* by a service (S-3), which is supported by two processes (P3: *P-3 Defining reusable case*; P4: *Querying similar domain case assets*) when stakeholders require a case reuse (event E3: *Require Reuse*).

## Documentation

The documentation of CoVaMaT can be found in the following works:

Osycka, L., Cechich, A., Buccella, A., Montenegro, A., Muñoz, A. (2023). CoVaMaT: Functionality for Variety Reuse Through a Supporting Tool. In: Naiouf, M., Rucci, E., Chichizola, F., De Giusti, L. (eds) Cloud Computing, Big Data & Emerging Topics. JCC-BD&ET 2023. Communications in Computer and Information Science, vol 1828. Springer, Cham. [Springer link](https://doi.org/10.1007/978-3-031-40942-4_5)

Osycka, L., Cechich, A.. Modelado Bottom-up de Variedad de Dominio en Sistemas Big Data. Tesis de Licenciatura en Sistemas de Información. Departamento de Ingeniería de Sistemas. Facultad de Informática, Universidad Nacional del Comahue. 2022. [Thesis link](https://www.fi.uncoma.edu.ar/index.php/nuevos-lic-lsi/osycka-liam-modelado-bottom-up-de-variedad-de-dominio-en-sistemas-big-data-noviembre-2022/)

Publications of the GIISCO Group [Publications](https://giisco.fi.uncoma.edu.ar/publicaciones-trs/)

## Basic Commands - Api Backend

Run the following commands:

<pre>
<code>
cd server
nvm use (linux)
nvm use 19.0.0 (windows)
npm i
npm start
</code></pre>
