-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2024 at 09:49 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `forklift`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `idAcc` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` text NOT NULL,
  `name` varchar(20) NOT NULL,
  `job` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`idAcc`, `username`, `password`, `name`, `job`) VALUES
(1, 'admin1', '202cb962ac59075b964b07152d234b70', '김다윤', ''),
(2, 'admin2', '202cb962ac59075b964b07152d234b70', '김다윤2', ''),
(3, 'f', 'f', '8fa14cdd754f91cc6554', 'f'),
(4, 'ff', '8fa14cdd754f91cc6554c9e71929cce7', 'g', 'f');

-- --------------------------------------------------------

--
-- Table structure for table `deduction`
--

CREATE TABLE `deduction` (
  `idDed` int(11) NOT NULL,
  `idRecord` int(11) NOT NULL,
  `idRule` int(11) NOT NULL,
  `value` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  `point` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deduction`
--

INSERT INTO `deduction` (`idDed`, `idRecord`, `idRule`, `value`, `description`, `point`) VALUES
(1, 1, 4, '0.1', '포크가 너무 낮음', 10),
(2, 1, 3, '0.1', '10 ~ 20cm 이내 삽입', 0),
(4, 2, 6, '0.1', '다음 포인트로 전진 이동', 10),
(6, 1, 2, '', '', 0);

--
-- Triggers `deduction`
--
DELIMITER $$
CREATE TRIGGER `numOfDedInRecord_delete` AFTER DELETE ON `deduction` FOR EACH ROW BEGIN
   SET @numOfDed = (SELECT COUNT(*) FROM deduction WHERE idRecord = OLD.idRecord);
    UPDATE record 
    SET deduction = @numOfDed
    WHERE idRecord = OLD.idRecord;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `numOfDedInRecord_insert` AFTER INSERT ON `deduction` FOR EACH ROW BEGIN
    SET @numOfDed = (SELECT COUNT(*) FROM deduction WHERE idRecord = NEW.idRecord);
    UPDATE record 
    SET deduction = @numOfDed
    WHERE idRecord = NEW.idRecord;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `numOfDedInRecord_update` AFTER UPDATE ON `deduction` FOR EACH ROW BEGIN
    SET @numOfDed = (SELECT COUNT(*) FROM deduction WHERE idRecord = NEW.idRecord);
    UPDATE record
    SET deduction = @numOfDed
    WHERE idRecord = NEW.idRecord;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `disqualification`
--

CREATE TABLE `disqualification` (
  `idDis` int(11) NOT NULL,
  `idRecord` int(11) NOT NULL,
  `idRule` int(11) NOT NULL,
  `value` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `disqualification`
--

INSERT INTO `disqualification` (`idDis`, `idRecord`, `idRule`, `value`, `description`) VALUES
(1, 1, 2, 'FALSE', '안전벨트를 착용하지 않았습니다.'),
(2, 2, 6, 'TRUE', '포크가 지면에 닿았습니다.'),
(3, 1, 6, 'FALSE', '안전벨트를 착용하지 않았습니다.'),
(4, 2, 11, 'FALSE', '포크가 너무 낮음');

--
-- Triggers `disqualification`
--
DELIMITER $$
CREATE TRIGGER `numOfDis_delete` AFTER DELETE ON `disqualification` FOR EACH ROW BEGIN
   SET @numOfDis = (SELECT COUNT(*) FROM disqualification WHERE idRecord = OLD.idRecord);
    UPDATE record 
    SET disqualification = @numOfDis
    WHERE idRecord = OLD.idRecord;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `numOfDis_insert` AFTER INSERT ON `disqualification` FOR EACH ROW BEGIN
    SET @numOfDis = (SELECT COUNT(*) FROM disqualification WHERE idRecord = NEW.idRecord);
    UPDATE record 
    SET disqualification = @numOfDis
    WHERE idRecord = NEW.idRecord;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `record`
--

CREATE TABLE `record` (
  `idRecord` int(11) NOT NULL,
  `idAcc` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `mode` varchar(20) NOT NULL,
  `deduction` int(11) NOT NULL,
  `disqualification` int(11) NOT NULL,
  `result` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `record`
--

INSERT INTO `record` (`idRecord`, `idAcc`, `date`, `mode`, `deduction`, `disqualification`, `result`) VALUES
(1, 1, '2023-08-01 02:55:28', 'model1', 3, 2, '합격'),
(2, 1, '2023-08-01 03:16:42', 'model2', 1, 2, '합격');

-- --------------------------------------------------------

--
-- Table structure for table `rule`
--

CREATE TABLE `rule` (
  `idRule` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `description` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rule`
--

INSERT INTO `rule` (`idRule`, `name`, `description`) VALUES
(1, 'Begin', '시작'),
(2, 'Forward_1', '전진1'),
(3, 'Lift_1', '파랫트 들기'),
(4, 'Back_1', '후진1'),
(5, 'Forward_2', '다음 포인트로 전진 이동'),
(6, 'Landing_1', '파랫트 내려놓기'),
(7, 'Back_2', '주차하기'),
(8, 'Lift_2', '파랫트 들기'),
(9, 'Back_3', '후진으로 이동하기'),
(10, 'Back_4', '후진으로 이동하기'),
(11, 'Forward_3', '드럼통으로 이동'),
(12, 'Landing_2', '파랫트 내려놓기'),
(13, 'Back_5', '주차하기'),
(14, 'Update', '업데이트');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`idAcc`);

--
-- Indexes for table `deduction`
--
ALTER TABLE `deduction`
  ADD PRIMARY KEY (`idDed`),
  ADD KEY `deduction_01` (`idRule`),
  ADD KEY `deduction_02` (`idRecord`);

--
-- Indexes for table `disqualification`
--
ALTER TABLE `disqualification`
  ADD PRIMARY KEY (`idDis`),
  ADD KEY `disqualification_01` (`idRule`),
  ADD KEY `disqualification_02` (`idRecord`);

--
-- Indexes for table `record`
--
ALTER TABLE `record`
  ADD PRIMARY KEY (`idRecord`),
  ADD KEY `record_ibfk_1` (`idAcc`);

--
-- Indexes for table `rule`
--
ALTER TABLE `rule`
  ADD PRIMARY KEY (`idRule`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `deduction`
--
ALTER TABLE `deduction`
  MODIFY `idDed` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `disqualification`
--
ALTER TABLE `disqualification`
  MODIFY `idDis` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `deduction`
--
ALTER TABLE `deduction`
  ADD CONSTRAINT `deduction_01` FOREIGN KEY (`idRule`) REFERENCES `rule` (`idRule`) ON DELETE CASCADE,
  ADD CONSTRAINT `deduction_02` FOREIGN KEY (`idRecord`) REFERENCES `record` (`idRecord`) ON DELETE CASCADE;

--
-- Constraints for table `disqualification`
--
ALTER TABLE `disqualification`
  ADD CONSTRAINT `disqualification_01` FOREIGN KEY (`idRule`) REFERENCES `rule` (`idRule`) ON DELETE CASCADE,
  ADD CONSTRAINT `disqualification_02` FOREIGN KEY (`idRecord`) REFERENCES `record` (`idRecord`) ON DELETE CASCADE;

--
-- Constraints for table `record`
--
ALTER TABLE `record`
  ADD CONSTRAINT `record_ibfk_1` FOREIGN KEY (`idAcc`) REFERENCES `account` (`idAcc`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
